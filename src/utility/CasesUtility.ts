export {};

// npx ts-node src/foo.ts

const csv = require("csv");
const fs = require("fs");

function processData() {
  fs.createReadStream("/Users/raymondhalim/Downloads/DOH COVID Data Drop_ 20210505 - 04 Case Information.csv")
    .pipe(csv.parse({ columns: true }))
    .pipe(
      csv.transform((input) => {
        delete input["CaseCode"];
        delete input["ProvRes"];
        delete input["CityMuniPSGC"];
        delete input["BarangayRes"];
        delete input["BarangayPSGC"];
        delete input["HealthStatus"];
        delete input["Quarantined"];
        delete input["Pregnanttab"];
        delete input["ValidationStatus"];
        return input;
      })
    )
    .pipe(csv.stringify({ header: true }))
    .pipe(fs.createWriteStream("./cases.csv"))
    .on("finish", () => {
      console.log("Done");
    })
    .on("error", (error: any) => {
      console.log("Error", error);
    });
}

processData();
