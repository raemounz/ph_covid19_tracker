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
  const [confirmedNew, setConfirmedNew] = useState<number>();
  const [recoveredNew, setRecoveredNew] = useState<number>();
  const [deathNew, setDeathNew] = useState<number>();

  useEffect(() => {
    if (props.data) {
      setConfirmed(props.data.length);
      setRecovered(props.data.filter((d: PHCase) => d.RemovalType === RemovalType.Recovered).length);
      setDeath(props.data.filter((d: PHCase) => d.RemovalType === RemovalType.Died).length);
      const prevDate = moment(props.date, "M/D/YYYY").format("DD-MMM-YYYY");
      const prevDateRem = moment(props.date, "M/D/YYYY").format("M/D/YYYY");
      setConfirmedNew(props.data.filter((d: PHCase) => d.DateRepConf === prevDate).length);
      setRecoveredNew(props.data.filter((d: PHCase) => d.DateRepRem === prevDateRem && d.RemovalType === RemovalType.Recovered).length);
      setDeathNew(props.data.filter((d: PHCase) => d.DateRepRem === prevDateRem && d.RemovalType === RemovalType.Died).length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <AppBanner
            label="Confirmed"
            value={confirmed}
            increase={confirmedNew}
            style={{ color: "#fff", background: "#ff5500" }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <AppBanner
            label="Recovered"
            value={recovered}
            increase={recoveredNew}
            style={{ color: "#fff", background: "#38a800" }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <AppBanner
            label="Deaths"
            value={death}
            increase={deathNew}
            style={{ color: "#fff", background: "#464646" }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Summary;
