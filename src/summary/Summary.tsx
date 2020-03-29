import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { mainService } from "../shared/service/main.service";
import AppBanner from "../shared/component/banner/AppBanner";

const Summary: React.FC = () => {
  const [confirmed, setConfirmed] = useState<number>();
  const [pui, setPUI] = useState<number>();
  const [pum, setPUM] = useState<number>();
  const [recovered, setRecovered] = useState<number>();
  const [death, setDeath] = useState<number>();
  const [tests, setTests] = useState<number>();

  useEffect(() => {
    const requests = [
      mainService.getConfirmedCases(),
      mainService.getPUICases(),
      mainService.getPUMCases(),
      mainService.getRecoveredCases(),
      mainService.getDeathCases(),
      mainService.getTestsConducted()
    ];
    Promise.all(requests).then((response: any[]) => {
      setConfirmed(response[0].data.features[0].attributes.value);
      setPUI(response[1].data.features[0].attributes.value);
      setPUM(response[2].data.features[0].attributes.value);
      setRecovered(response[3].data.features[0].attributes.value);
      setDeath(response[4].data.features[0].attributes.value);
      setTests(response[5].data.features[0].attributes.value);
    });
  }, []);

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} md={2}>
          <AppBanner
            label="Confirmed"
            value={confirmed}
            style={{ color: "#fff", background: "#ff5500" }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <AppBanner
            label="Recovered"
            value={recovered}
            style={{ color: "#fff", background: "#38a800" }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <AppBanner
            label="Deaths"
            value={death}
            style={{ color: "#fff", background: "#464646" }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
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
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Summary;
