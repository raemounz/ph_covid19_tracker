import React, { useState } from "react";
import {
  Grid,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import Summary from "./Summary";
import AppCard from "../shared/component/card/AppCard";
import DailyTimeChart from "../chart/time/DailyTimeChart";
import { CaseType } from "../shared/service/main.service";
import CameraAltIcon from "@material-ui/icons/CameraAlt";

interface Props {
  takeScreenshot: any;
}

const MainSummary: React.FC<Props> = (props: Props) => {
  const [caseType, setCaseType] = useState(CaseType.Confirmed);
  const [regionCity, setRegionCity] = useState<any>();

  return (
    <Grid container spacing={3} id="mainSummary">
      <Grid item xs={12} lg={3}>
        <Summary
          caseType={caseType}
          onChangeRegionCity={setRegionCity}
          onChangeCaseType={(_case: any) => {
            if (caseType === _case) {
              setCaseType(CaseType.All);
            } else {
              setCaseType(_case);
            }
          }}
        />
      </Grid>
      <Grid item xs={12} lg={9}>
        <AppCard
          id="casesByTime"
          title="Cases by Time"
          style={{
            height: "696px",
            header: {
              height: "60px",
            },
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
                  .filter((c: string) => c !== CaseType.Active)
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
          content={
            <DailyTimeChart caseType={caseType} regionCity={regionCity} />
          }
          action={
            <span>
              <Tooltip title="Take a screenshot">
                <IconButton
                  data-html2canvas-ignore
                  onClick={() => props.takeScreenshot("mainSummary")}
                >
                  <CameraAltIcon />
                </IconButton>
              </Tooltip>
            </span>
          }
        ></AppCard>
      </Grid>
    </Grid>
  );
};

export default MainSummary;
