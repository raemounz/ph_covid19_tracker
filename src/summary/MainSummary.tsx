import React, { useState } from "react";
import {
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

import Summary from "./Summary";
import AppCard from "../shared/component/card/AppCard";
import DailyTimeChart from "../chart/time/DailyTimeChart";
import { CaseType } from "../shared/service/main.service";

interface Props {
  takeScreenshot: any;
}

const MainSummary: React.FC<Props> = (props: Props) => {
  const [caseType, setCaseType] = useState(CaseType.Confirmed);
  const [regionCity, setRegionCity] = useState<any>();

  return (
    <Grid container spacing={3} id="mainSummary">
      <Grid item xs={12} lg={3}>
        <Summary caseType={caseType} onChangeRegionCity={setRegionCity} />
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
              size="small"
              color="secondary"
              style={{ minWidth: 120, top: -3, marginRight: 8 }}
            >
              <Select
                value={caseType}
                onChange={(event: any) => setCaseType(event.target.value)}
              >
                {Object.keys(CaseType)
                  .filter((c: string) => c !== CaseType.Active)
                  .map((item: string) => (
                    <MenuItem key={item} value={item}>
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
                  <CameraAltOutlinedIcon />
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
