import React, { useRef } from "react";
import "./App.scss";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  ThemeProvider,
  Grid,
  IconButton
} from "@material-ui/core";
import theme from "./shared/theme";
import Summary from "./summary/Summary";
import AppCard from "./shared/component/card/AppCard";
import ResidenceChart from "./chart/residence/ResidenceChart";
import RefreshIcon from "@material-ui/icons/Refresh";
import TimeChart from "./chart/time/TimeChart";
import Header from "./header/Header";

const App: React.FC = () => {
  const residenceMapRef: any = useRef();

  return (
    <div className="App">
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" style={{ width: "100%" }}>
              <Header />
            </Typography>
          </Toolbar>
        </AppBar>
        <main className="container">
          <Grid container spacing={3}>
            <Summary />
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <AppCard
                        id="residence-chart"
                        title="Confirmed Cases by Residence"
                        action={
                          <IconButton
                            onClick={() => residenceMapRef.current.reset()}
                          >
                            <RefreshIcon />
                          </IconButton>
                        }
                        style={{
                          height: "500px"
                        }}
                        content={
                          <ResidenceChart
                            ref={residenceMapRef}
                            containerId="residence-chart"
                          />
                        }
                      ></AppCard>
                    </Grid>
                    <Grid item xs={12}>
                      <AppCard
                        title="Confirmed Cases by Time"
                        style={{
                          height: "500px",
                          content: {
                            height: "calc(100% - 60px)"
                          }
                        }}
                        content={<TimeChart />}
                      ></AppCard>
                    </Grid>
                    <Grid item xs={12}>
                      <AppCard
                        title="Confirmed Cases by Age Group"
                        style={{
                          height: "500px"
                        }}
                      ></AppCard>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <AppCard
                        title="Confirmed Cases Distribution"
                        style={{
                          height: "1024px"
                        }}
                      ></AppCard>
                    </Grid>
                    <Grid item xs={12}>
                      <AppCard
                        title="Confirmed Cases Details"
                        style={{
                          height: "500px"
                        }}
                      ></AppCard>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </main>
      </ThemeProvider>
    </div>
  );
};

export default App;
