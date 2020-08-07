import React, { useState } from "react";
import { Grid, FormControl, Select, MenuItem } from "@material-ui/core";
import AppCard from "../../shared/component/card/AppCard";
import AgeChart from "./AgeChart";

interface Props {
  data: any;
}

const MainAgeChart: React.FC<Props> = (props: Props) => {
  const [caseType, setCaseType] = useState("Confirmed");

  return (
    <Grid item xs={12} md={6}>
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
              {["Active", "Confirmed", "Recovered", "Death"].map(
                (item: string) => (
                  <MenuItem
                    key={item}
                    value={item}
                    style={{ fontSize: ".9em" }}
                  >
                    {item}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        }
        content={<AgeChart data={{ data: props.data, caseType: caseType }} />}
      ></AppCard>
    </Grid>
  );
};

export default MainAgeChart;
