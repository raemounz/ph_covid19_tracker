import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { mainService } from "../shared/service/main.service";
import AppBanner from "../shared/component/banner/AppBanner";

const Summary: React.FC = () => {
  const [confirmed, setConfirmed] = useState<number | string>();
  const [pui, setPUI] = useState<number | string>();
  const [pum, setPUM] = useState<number | string>();
  const [recovered, setRecovered] = useState<number | string>();
  const [death, setDeath] = useState<number | string>();
  const [tests, setTests] = useState<number | string>();
  const [confirmedOld, setConfirmedOld] = useState<number>();
  const [recoveredOld, setRecoveredOld] = useState<number>();
  const [deathOld, setDeathOld] = useState<number>();

  useEffect(() => {
    const requests = [
      mainService.getConfirmedCases(),
      mainService.getPUICases(),
      mainService.getPUMCases(),
      mainService.getRecoveredCases(),
      mainService.getDeathCases(),
      mainService.getTestsConducted(),
      mainService.getHistorical()
    ];
    Promise.all(requests).then((response: any[]) => {
      setConfirmed(response[0].data.features[0].attributes.value || "No data");
      setPUI(response[1].data.features[0].attributes.value || "No data");
      setPUM(response[2].data.features[0].attributes.value || "No data");
      setRecovered(response[3].data.features[0].attributes.value || "No data");
      setDeath(response[4].data.features[0].attributes.value || "No data");
      setTests(response[5].data.features[0].attributes.value || "No data");
      setConfirmedOld(Number(Object.values(response[6].data.timeline.cases).pop()));
      setRecoveredOld(Number(Object.values(response[6].data.timeline.recovered).pop()));
      setDeathOld(Number(Object.values(response[6].data.timeline.deaths).pop()));
    });
  }, []);

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <AppBanner
            label="Confirmed"
            value={confirmed}
            oldValue={confirmedOld}
            style={{ color: "#fff", background: "#ff5500" }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <AppBanner
            label="Recovered"
            value={recovered}
            oldValue={recoveredOld}
            style={{ color: "#fff", background: "#38a800" }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <AppBanner
            label="Deaths"
            value={death}
            oldValue={deathOld}
            style={{ color: "#fff", background: "#464646" }}
          />
        </Grid>
        {/* <Grid item xs={12} sm={4} md={2}>
          <AppBanner
            label="PUIs"
            desc="Persons under investigation"
            value={pui}
            style={{ color: "inherit", background: "#fff" }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <AppBanner
            label="PUMs"
            desc="Persons under monitoring"
            value={pum}
            style={{ color: "inherit", background: "#fff" }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <AppBanner
            label="Tests"
            value={tests}
            style={{ color: "inherit", background: "#fff" }}
          />
        </Grid> */}
      </Grid>
    </Grid>
  );
};

export default Summary;
