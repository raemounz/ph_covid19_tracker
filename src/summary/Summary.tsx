import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import AppBanner from "../shared/component/banner/AppBanner";
// eslint-disable-next-line no-unused-vars
import { PHCase, RemovalType, CaseType } from "../shared/service/main.service";
import { Constants } from "../shared/Constants";

interface Props {
  data: PHCase[] | undefined;
  date: string;
  filter: any;
  // eslint-disable-next-line no-unused-vars
  onChangeCaseType: (caseType: string) => void;
}

const Summary: React.FC<Props> = (props: Props) => {
  const [confirmed, setConfirmed] = useState<number | string>();
  const [recovered, setRecovered] = useState<number | string>();
  const [death, setDeath] = useState<number | string>();
  const [active, setActive] = useState<number | string>();
  const [confirmedNew, setConfirmedNew] = useState<number>();

  useEffect(() => {
    if (props.data) {
      const currentDate = props.date;
      const _confirmed = props.data.length;
      const _recovered = props.data.filter(
        (d: PHCase) => d.RemovalType === RemovalType.Recovered
      ).length;
      const _death = props.data.filter(
        (d: PHCase) => d.RemovalType === RemovalType.Died
      ).length;
      const _confirmedNew = props.data.filter(
        (d: PHCase) => d.DateRepConf === currentDate
      ).length;
      setConfirmed(_confirmed);
      setRecovered(_recovered);
      setDeath(_death);
      setActive(_confirmed - _recovered - _death);
      setConfirmedNew(_confirmedNew);
      if (props.filter.summary) {
        setConfirmed(props.filter.summary[CaseType.Confirmed]);
        setRecovered(props.filter.summary[CaseType.Recovered]);
        setDeath(props.filter.summary[CaseType.Deaths]);
        setActive(props.filter.summary[CaseType.Active]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, props.filter.summary]);

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AppBanner
            label={CaseType.Active}
            value={active}
            selectable={false}
            style={{ background: Constants.activeColor }}
            selected={props.filter.caseType}
            regionCity={props.filter.regionCity}
            onClick={() => {}}
          />
        </Grid>
        <Grid item xs={12}>
          <AppBanner
            label={CaseType.Confirmed}
            value={confirmed}
            increase={confirmedNew}
            selectable={true}
            style={{ background: Constants.confirmedColor }}
            selected={props.filter.caseType}
            regionCity={props.filter.regionCity}
            onClick={props.onChangeCaseType}
          />
        </Grid>
        <Grid item xs={12}>
          <AppBanner
            label={CaseType.Recovered}
            value={recovered}
            selectable={true}
            style={{ background: Constants.recoveredColor }}
            selected={props.filter.caseType}
            regionCity={props.filter.regionCity}
            onClick={props.onChangeCaseType}
          />
        </Grid>
        <Grid item xs={12}>
          <AppBanner
            label={CaseType.Deaths}
            value={death}
            selectable={true}
            style={{ background: Constants.deathColor }}
            selected={props.filter.caseType}
            regionCity={props.filter.regionCity}
            onClick={props.onChangeCaseType}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Summary;
