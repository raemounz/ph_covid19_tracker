import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";

import { CaseType, mainService } from "../shared/service/main.service";
import AppBanner from "../shared/component/banner/AppBanner";
import { Constants } from "../shared/Constants";
import RegionCity from "./RegionCity";

interface Props {
  caseType: CaseType;
  // eslint-disable-next-line no-unused-vars
  onChangeRegionCity: (regionCity: any) => void;
}

const Summary: React.FC<Props> = (props: Props) => {
  const [summary, setSummary] = useState<any>([]);
  const [newCases, setNewCases] = useState<any>();
  const [regionCity, setRegionCity] = useState<any>({
    region: Constants.allRegions,
    city: Constants.allCities,
  });
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    if (regionCity) {
      setInProgress(true);
      mainService
        .getSummary(
          regionCity.region === Constants.allRegions ? "" : regionCity.region,
          regionCity.city === Constants.allCities ? "" : regionCity.city
        )
        .then((response: any) => {
          setSummary(response.data.summary);
          setNewCases(response.data.newCases);
          setInProgress(false);
        });
    }
  }, [regionCity]);

  const getSummaryCount = (caseType: CaseType) => {
    return summary.find(
      (s: any) => s.case.toLowerCase() === caseType.toLowerCase()
    )?.count;
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <RegionCity
            onChangeRegionCity={(rc: any) => {
              setRegionCity(rc);
              props.onChangeRegionCity(rc);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <AppBanner
            label={CaseType.Active}
            value={getSummaryCount(CaseType.Active)}
            style={{
              background: Constants.activeColor,
              color: Constants.grayFontColor,
            }}
            inProgress={inProgress}
          />
        </Grid>
        <Grid item xs={12}>
          <AppBanner
            label={CaseType.Confirmed}
            value={getSummaryCount(CaseType.Confirmed)}
            increase={newCases}
            style={{ background: Constants.confirmedColor, minHeight: 167 }}
            inProgress={inProgress}
          />
        </Grid>
        <Grid item xs={12}>
          <AppBanner
            label={CaseType.Recovered}
            value={getSummaryCount(CaseType.Recovered)}
            style={{
              background: Constants.recoveredColor,
              color: Constants.grayFontColor,
            }}
            inProgress={inProgress}
          />
        </Grid>
        <Grid item xs={12}>
          <AppBanner
            label={CaseType.Deaths}
            value={getSummaryCount(CaseType.Deaths)}
            style={{ background: Constants.deathColor }}
            inProgress={inProgress}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Summary;
