import React, { useState } from "react";
import { FormControl, Grid, MenuItem, Select } from "@mui/material";

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
            size="small"
            color="secondary"
            style={{ minWidth: 120, top: -3, marginRight: 8 }}
          >
            <Select
              value={caseType}
              onChange={(event: any) => setCaseType(event.target.value)}
            >
              {Object.keys(CaseType)
                .filter((ct: string) => ct !== CaseType.All)
                .map((item: string) => (
                  <MenuItem key={item} value={item}>
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
