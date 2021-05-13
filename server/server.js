const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "..", "build");
const { MongoClient } = require("mongodb");

app.use(express.static(publicPath));

const db_username = `${process.env.REACT_APP_DB_USERNAME}`;
const db_password = `${process.env.REACT_APP_DB_PASSWORD}`;
const uri = `mongodb+srv://${db_username}:${db_password}@phcovid19tracker.qnzno.mongodb.net/phcovid19`;

MongoClient.connect(uri, (error, client) => {
  if (error) throw error;
  const db = client.db("phcovid19");
  const coll = db.collection("cases");

  app.get("/asof", (req, res) => {
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
    coll.aggregate(query, (cmdErr, result) => {
      result.next((err, r) => {
        res.json(r);
      });
    });
  });

  app.get("/areas", (req, res) => {
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
    coll.aggregate(query, (cmdErr, result) => {
      result.toArray((err, r) => res.json(r));
    });
  });

  app.get("/summary", (req, res) => {
    const region = req.query.region;
    const city = req.query.city;
    const match = { $match: {} };
    if (region) {
      match.$match.RegionRes = region;
    }
    if (city) {
      match.$match.CityMunRes = city;
    }
    const query = [
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
    ];
    if (Object.keys(match.$match).length > 0) {
      query.unshift(match);
    }
    coll.aggregate(query, (cmdErr, result) => {
      result.toArray((err, r) => {
        const total = r.reduce((a, b) => a + b.count, 0);
        r.push({ case: "CONFIRMED", count: total });
        res.json(r);
      });
    });
  });

  app.get("/timeseries", (req, res) => {
    const region = req.query.region;
    const city = req.query.city;
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
          date: -1,
        },
      },
    ];
    if (Object.keys(match.$match).length > 0) {
      query.unshift(match);
    }
    coll.aggregate(query, (cmdErr, result) => {
      result.toArray((err, r) => {
        r.forEach((_r) => {
          const total = _r.cases.reduce((a, b) => a + b.count, 0);
          _r.cases.push({ case: "TOTAL", count: total });
        });
        res.json(r);
      });
    });
  });

  app.get("/top", (req, res) => {
    const limit = Number(req.query.limit) || 30;
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
                    then: "DIED",
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
    coll.aggregate(query, (cmdErr, result) => {
      result.toArray((err, r) => {
        r.forEach((_r) => {
          _r.cases.push({ case: "TOTAL", count: _r.total });
          delete _r.total;
        });
        res.json(r);
      });
    });
  });

  app.get("/agegroup", (req, res) => {
    const query = [
      {
        $group: {
          _id: {
            ageGroup: {
              $ifNull: ["$AgeGroup", "For Validation"],
            },
            status: {
              $ifNull: ["$RemovalType", "ACTIVE"],
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
    coll.aggregate(query, (cmdErr, result) => {
      result.toArray((err, r) => {
        r.forEach((_r) => {
          const totalMale = _r.cases
            .filter((c) => c.sex === "MALE")
            .reduce((a, b) => a + b.count, 0);
          const totalFemale = _r.cases
            .filter((c) => c.sex === "FEMALE")
            .reduce((a, b) => a + b.count, 0);
          _r.cases.push({ case: "TOTAL", sex: "MALE", count: totalMale });
          _r.cases.push({ case: "TOTAL", sex: "FEMALE", count: totalFemale });
        });

        res.json(r);
      });
    });
  });

  app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });

  app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
  });
});
