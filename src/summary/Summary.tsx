import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import AppBanner from "../shared/component/banner/AppBanner";
import { PHCase, RemovalType, CaseType } from "../shared/service/main.service";
import { Constants } from "../shared/Constants";

interface Props {
  data: PHCase[] | undefined;
  date: string;
  caseType: string;
  onChangeCaseType: (caseType: string) => void;
}

const Summary: React.FC<Props> = (props: Props) => {
  const [confirmed, setConfirmed] = useState<number | string>();
  const [recovered, setRecovered] = useState<number | string>();
  const [death, setDeath] = useState<number | string>();
  const [active, setActive] = useState<number | string>();
  const [confirmedNew, setConfirmedNew] = useState<number>();
  const [recoveredNew, setRecoveredNew] = useState<number>();
  const [deathNew, setDeathNew] = useState<number>();
  const [activeNew, setActiveNew] = useState<number>();

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
      const _recoveredNew = props.data.filter(
        (d: PHCase) =>
          d.DateRepRem === currentDate &&
          d.RemovalType === RemovalType.Recovered
      ).length;
      const _deathNew = props.data.filter(
        (d: PHCase) =>
          d.DateRepRem === currentDate && d.RemovalType === RemovalType.Died
      ).length;
      setConfirmed(_confirmed);
      setRecovered(_recovered);
      setDeath(_death);
      setActive(_confirmed - _recovered - _death);
      setConfirmedNew(_confirmedNew);
      setRecoveredNew(_recoveredNew);
      setDeathNew(_deathNew);
      setActiveNew(_confirmedNew - _recoveredNew - _deathNew);

      // Hardcode values if latest data is not yet available
      setConfirmed(29400);
      setRecovered(7650);
      setDeath(1150);
      setActive(20600);
      setConfirmedNew(943);
      setRecoveredNew(272);
      setDeathNew(20);
      setActiveNew(943 - 272 - 20);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AppBanner
            label={CaseType.Active}
            value={active}
            increase={activeNew}
            selectable={false}
            style={{ background: Constants.activeColor }}
            selected={props.caseType}
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
            selected={props.caseType}
            onClick={props.onChangeCaseType}
          />
        </Grid>
        <Grid item xs={12}>
          <AppBanner
            label={CaseType.Recovered}
            value={recovered}
            increase={recoveredNew}
            selectable={true}
            style={{ background: Constants.recoveredColor }}
            selected={props.caseType}
            onClick={props.onChangeCaseType}
          />
        </Grid>
        <Grid item xs={12}>
          <AppBanner
            label={CaseType.Deaths}
            value={death}
            increase={deathNew}
            selectable={true}
            style={{ background: Constants.deathColor }}
            selected={props.caseType}
            onClick={props.onChangeCaseType}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Summary;
