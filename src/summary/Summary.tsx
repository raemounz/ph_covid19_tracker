import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { CaseType, mainService } from "../shared/service/main.service";
import AppBanner from "../shared/component/banner/AppBanner";
import { Constants } from "../shared/Constants";
import RegionCity from "./RegionCity";

interface Props {
  caseType: CaseType;
  // eslint-disable-next-line no-unused-vars
  onChangeCaseType: (caseType: string) => void;
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
      <Grid container spacing={3}>
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
            selectable={false}
            style={{ background: Constants.activeColor }}
            selected={props.caseType}
            onClick={() => {}}
            inProgress={inProgress}
          />
        </Grid>
        <Grid item xs={12}>
          <AppBanner
            label={CaseType.Confirmed}
            value={getSummaryCount(CaseType.Confirmed)}
            increase={newCases}
            selectable={true}
            style={{ background: Constants.confirmedColor, minHeight: 147 }}
            selected={props.caseType}
            onClick={props.onChangeCaseType}
            inProgress={inProgress}
          />
        </Grid>
        <Grid item xs={12}>
          <AppBanner
            label={CaseType.Recovered}
            value={getSummaryCount(CaseType.Recovered)}
            selectable={true}
            style={{ background: Constants.recoveredColor }}
            selected={props.caseType}
            onClick={props.onChangeCaseType}
            inProgress={inProgress}
          />
        </Grid>
        <Grid item xs={12}>
          <AppBanner
            label={CaseType.Deaths}
            value={getSummaryCount(CaseType.Deaths)}
            selectable={true}
            style={{ background: Constants.deathColor }}
            selected={props.caseType}
            onClick={props.onChangeCaseType}
            inProgress={inProgress}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Summary;
