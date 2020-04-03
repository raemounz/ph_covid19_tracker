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
      setConfirmed(response[0].data.features[0].attributes.value || "No data");
      setPUI(response[1].data.features[0].attributes.value || "No data");
      setPUM(response[2].data.features[0].attributes.value || "No data");
      setRecovered(response[3].data.features[0].attributes.value || "No data");
      setDeath(response[4].data.features[0].attributes.value || "No data");
      setTests(response[5].data.features[0].attributes.value || "No data");
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
