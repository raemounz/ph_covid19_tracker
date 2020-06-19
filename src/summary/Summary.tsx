import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import AppBanner from "../shared/component/banner/AppBanner";
import { PHCase, RemovalType } from "../shared/service/main.service";
import moment from "moment";

interface Props {
  data: PHCase[] | undefined;
  date: string;
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
      // const currentDate = moment(new Date(props.date), "YYYY-MM-DD").format("M/DD/YYYY");
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
          d.DateRepRem === currentDate && d.RemovalType === RemovalType.Recovered
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

      // Hardcode values since data is not available
      setConfirmed(28459);
      setRecovered(7378);
      setDeath(1130);
      setActive(19951);
      setConfirmedNew(660);
      setRecoveredNew(288);
      setDeathNew(14);
      setActiveNew(660 - 288 - 14);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AppBanner
            label="Active"
            value={active}
            increase={activeNew}
            selectable={false}
            style={{ background: "#f6b44e" }}
          />
        </Grid>
        <Grid item xs={12}>
          <AppBanner
            label="Confirmed"
            value={confirmed}
            increase={confirmedNew}
            selectable={true}
            style={{ background: "#df734f" }}
          />
        </Grid>
        <Grid item xs={12}>
          <AppBanner
            label="Recovered"
            value={recovered}
            increase={recoveredNew}
            selectable={true}
            style={{ background: "#bfa37e" }}
          />
        </Grid>
        <Grid item xs={12}>
          <AppBanner
            label="Deaths"
            value={death}
            increase={deathNew}
            selectable={true}
            style={{ background: "#4b4743" }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Summary;
