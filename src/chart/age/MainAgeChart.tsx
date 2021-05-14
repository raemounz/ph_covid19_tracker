import React, { useState } from "react";
import { Grid, FormControl, Select, MenuItem } from "@material-ui/core";
import AppCard from "../../shared/component/card/AppCard";
import AgeChart from "./AgeChart";
import { CaseType } from "../../shared/service/main.service";

const MainAgeChart: React.FC = () => {
  const [caseType, setCaseType] = useState(CaseType.Confirmed);

  return (
    <Grid item xs={12} lg={6}>
      <AppCard
        id="casesByAgeGroup"
        title="Cases by Age Group"
        style={{
          height: "600px",
          content: {
            height: "calc(100% - 60px)",
            paddingTop: 0,
          },
        }}
        selection={
          <FormControl
            variant="outlined"
            style={{ minWidth: "120px", top: "-3px", marginRight: "8px" }}
          >
            <Select
              value={caseType}
              onChange={(event: any) => setCaseType(event.target.value)}
            >
              {Object.keys(CaseType)
                .filter((ct: string) => ct !== CaseType.All)
                .map((item: string) => (
                  <MenuItem
                    key={item}
                    value={item}
                    style={{ fontSize: ".9em" }}
                  >
                    {item}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        }
        content={<AgeChart caseType={caseType} />}
      ></AppCard>
    </Grid>
  );
};

export default MainAgeChart;
