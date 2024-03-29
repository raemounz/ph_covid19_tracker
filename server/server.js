const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "..", "build");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const redis = require("redis");
const redisClient = redis.createClient({
  url: `${process.env.REDIS_URL}`,
});
redisClient.connect();

var whitelist = `${process.env.ALLOWED_ORIGINS}`;
var corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.split(",").indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Request from ${origin} is not allowed.`));
    }
  },
};

redisClient.on("error", (err) => console.log(err));

app.use(express.static(publicPath));

const uri = `${process.env.DB_CONNECTION}`;

MongoClient.connect(uri, { useUnifiedTopology: true }, (error, client) => {
  if (error) throw error;
  const db = client.db("phcovid19");
  const coll = db.collection("cases");

  app.get("/asof", async (req, res) => {
    const cache = await redisClient.get("asof");
    if (cache) {
      res.json(JSON.parse(cache));
    } else {
      const query = [
        {
          $sort: {
            DateRepConf: -1,
          },
        },
        {
          $limit: 1,
        },
        {
          $project: {
            _id: 0,
            date: "$DateRepConf",
          },
        },
      ];
      const result = await coll.aggregate(query);
      result.next((err, r) => {
        redisClient.set("asof", JSON.stringify(r));
        res.json(r);
      });
    }
  });

  app.get("/areas", cors(corsOptions), async (req, res) => {
    const cache = await redisClient.get("areas");
    if (cache) {
      res.json(JSON.parse(cache));
    } else {
      const query = [
        {
          $group: {
            _id: {
              $ifNull: ["$RegionRes", "For Validation"],
            },
            cities: {
              $addToSet: {
                $ifNull: ["$CityMunRes", "For Validation"],
              },
            },
          },
        },
        {
          $project: {
            region: "$_id",
            cities: "$cities",
            _id: 0,
          },
        },
      ];
      const result = await coll.aggregate(query);
      result.toArray((err, r) => {
        const map = {};
        r.forEach((_r) => {
          map[_r.region] = _r.cities;
        });
        redisClient.set("areas", JSON.stringify(map));
        res.json(map);
      });
    }
  });

  app.get("/summary", cors(corsOptions), async (req, res) => {
    const region = req.query.region;
    const city = req.query.city;
    const cache = await redisClient.get(`summary:${region}:${city}`);
    if (cache) {
      res.json(JSON.parse(cache));
    } else {
      const match = { $match: {} };
      if (region) {
        match.$match.RegionRes = region;
      }
      if (city) {
        match.$match.CityMunRes = city;
      }
      const query = [
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: {
                    $cond: {
                      if: { $eq: ["$RemovalType", "DIED"] },
                      then: "DEATHS",
                      else: { $ifNull: ["$RemovalType", "ACTIVE"] },
                    },
                  },
                  count: {
                    $sum: 1,
                  },
                },
              },
              {
                $project: {
                  case: "$_id",
                  count: "$count",
                  _id: 0,
                },
              },
            ],
            increase: [
              {
                $group: {
                  _id: "$DateRepConf",
                  count: {
                    $sum: 1,
                  },
                },
              },
              {
                $sort: {
                  _id: -1,
                },
              },
              {
                $limit: 1,
              },
              {
                $project: {
                  count: "$count",
                  _id: 0,
                },
              },
            ],
          },
        },
      ];
      if (Object.keys(match.$match).length > 0) {
        query.unshift(match);
      }
      const result = await coll.aggregate(query);
      result.toArray((err, r) => {
        const total = r[0].summary.reduce((a, b) => a + b.count, 0);
        r[0].summary.push({ case: "CONFIRMED", count: total });
        r[0].newCases = r[0].increase[0]?.count;
        delete r[0].increase;
        redisClient.set(`summary:${region}:${city}`, JSON.stringify(r[0]));
        res.json(r[0]);
      });
    }
  });

  app.get("/timeseries", cors(corsOptions), async (req, res) => {
    const region = req.query.region;
    const city = req.query.city;
    const cache = await redisClient.get(`timeseries:${region}:${city}`);
    if (cache) {
      res.json(JSON.parse(cache));
    } else {
      const match = { $match: {} };
      if (region) {
        match.$match.RegionRes = region;
      }
      if (city) {
        match.$match.CityMunRes = city;
      }
      const query = [
        {
          $project: {
            date: "$DateRepConf",
            status: {
              $cond: {
                if: { $eq: ["$RemovalType", "DIED"] },
                then: "DEATHS",
                else: { $ifNull: ["$RemovalType", "ACTIVE"] },
              },
            },
            region: {
              $ifNull: ["$RegionRes", "For Validation"],
            },
            city: {
              $ifNull: ["$CityMunRes", "For Validation"],
            },
          },
        },
        {
          $group: {
            _id: {
              date: "$date",
              status: "$status",
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $group: {
            _id: "$_id.date",
            status: {
              $push: {
                case: "$_id.status",
                count: "$count",
              },
            },
          },
        },
        {
          $project: {
            date: "$_id",
            cases: "$status",
            _id: 0,
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
      ];
      if (Object.keys(match.$match).length > 0) {
        query.unshift(match);
      }
      const result = await coll.aggregate(query);
      let CONFIRMED = 0;
      let RECOVERED = 0;
      let DEATHS = 0;
      result.toArray((err, r) => {
        r.forEach((_r) => {
          const total = _r.cases.reduce((a, b) => a + b.count, 0);
          _r.cases.push({ case: "CONFIRMED", count: total });
          const recoveredCase = _r.cases.find((c) => c.case === "RECOVERED");
          const deathCase = _r.cases.find((c) => c.case === "DEATHS");
          const activeCase = _r.cases.find((c) => c.case === "ACTIVE");
          RECOVERED += recoveredCase?.count || 0;
          DEATHS += deathCase?.count || 0;
          CONFIRMED += total;
          if (!recoveredCase) {
            _r.cases.push({ case: "RECOVERED", count: 0 });
          }
          if (!deathCase) {
            _r.cases.push({ case: "DEATHS", count: 0 });
          }
          if (!activeCase) {
            _r.cases.push({ case: "ACTIVE", count: 0 });
          }
          _r.cases.push({
            case: "TOTAL ACTIVE",
            count: CONFIRMED - RECOVERED - DEATHS,
          });
          _r.cases.push({ case: "TOTAL RECOVERED", count: RECOVERED });
          _r.cases.push({ case: "TOTAL DEATHS", count: DEATHS });
          _r.cases.push({ case: "TOTAL CONFIRMED", count: CONFIRMED });
        });
        redisClient.set(`timeseries:${region}:${city}`, JSON.stringify(r));
        res.json(r);
      });
    }
  });

  app.get("/top", cors(corsOptions), async (req, res) => {
    const limit = Number(req.query.limit) || 30;
    const cache = await redisClient.get(`top${limit}`);
    if (cache) {
      res.json(JSON.parse(cache));
    } else {
      const query = [
        {
          $group: {
            _id: {
              city: {
                $ifNull: ["$CityMunRes", "For Validation"],
              },
              status: {
                $switch: {
                  branches: [
                    {
                      case: {
                        $eq: ["$RemovalType", "DIED"],
                      },
                      then: "DEATHS",
                    },
                    {
                      case: {
                        $eq: ["$RemovalType", "RECOVERED"],
                      },
                      then: "RECOVERED",
                    },
                    {
                      case: {
                        $eq: ["$Admitted", "YES"],
                      },
                      then: "ADMITTED",
                    },
                  ],
                  default: "NOT ADMITTED",
                },
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $group: {
            _id: "$_id.city",
            cases: {
              $push: {
                case: "$_id.status",
                count: "$count",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            city: "$_id",
            cases: "$cases",
            total: {
              $sum: "$cases.count",
            },
          },
        },
        {
          $sort: {
            total: -1,
          },
        },
        {
          $limit: limit,
        },
      ];
      const result = await coll.aggregate(query);
      result.toArray((err, r) => {
        r.forEach((_r) => {
          _r.cases.push({ case: "TOTAL", count: _r.total });
          _r.cases.push({
            case: "ACTIVE",
            count: _r.cases
              .filter((c) => ["ADMITTED", "NOT ADMITTED"].includes(c.case))
              .reduce((a, b) => a + b.count, 0),
          });
          delete _r.total;
        });
        redisClient.set(`top${limit}`, JSON.stringify(r));
        res.json(r);
      });
    }
  });

  app.get("/agegroup", cors(corsOptions), async (req, res) => {
    const cache = await redisClient.get("agegroup");
    if (cache) {
      res.json(JSON.parse(cache));
    } else {
      const query = [
        {
          $group: {
            _id: {
              ageGroup: {
                $ifNull: ["$AgeGroup", "For Validation"],
              },
              status: {
                $cond: {
                  if: { $eq: ["$RemovalType", "DIED"] },
                  then: "DEATHS",
                  else: { $ifNull: ["$RemovalType", "ACTIVE"] },
                },
              },
              sex: "$Sex",
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $group: {
            _id: "$_id.ageGroup",
            cases: {
              $push: {
                case: "$_id.status",
                sex: "$_id.sex",
                count: "$count",
              },
            },
          },
        },
        {
          $project: {
            ageGroup: "$_id",
            cases: "$cases",
            _id: 0,
          },
        },
      ];
      const result = await coll.aggregate(query);
      result.toArray((err, r) => {
        r.forEach((_r) => {
          const totalMale = _r.cases
            .filter((c) => c.sex === "MALE")
            .reduce((a, b) => a + b.count, 0);
          const totalFemale = _r.cases
            .filter((c) => c.sex === "FEMALE")
            .reduce((a, b) => a + b.count, 0);
          _r.cases.push({
            case: "CONFIRMED",
            sex: "MALE",
            count: totalMale,
          });
          _r.cases.push({
            case: "CONFIRMED",
            sex: "FEMALE",
            count: totalFemale,
          });
        });
        const ageMap = {};
        r.forEach((_r) => {
          ageMap[_r.ageGroup] = {};
          _r.cases.forEach((c) => {
            let caseType = ageMap[_r.ageGroup][c.case];
            if (!caseType) {
              caseType = {};
            }
            caseType[c.sex] = c.count;
            ageMap[_r.ageGroup][c.case] = caseType;
          });
        });
        redisClient.set("agegroup", JSON.stringify(ageMap));
        res.json(ageMap);
      });
    }
  });

  app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });

  app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
  });

  app.use((err, req, res, next) => res.status(401).send(err.message));
});
