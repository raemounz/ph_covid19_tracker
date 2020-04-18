import React, { useRef, useEffect, useState } from "react";
import "./App.scss";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  ThemeProvider,
  Grid,
  IconButton,
  useMediaQuery,
} from "@material-ui/core";
import theme from "./shared/theme";
import Summary from "./summary/Summary";
import AppCard from "./shared/component/card/AppCard";
import ResidenceChart from "./chart/residence/ResidenceChart";
import RefreshIcon from "@material-ui/icons/Refresh";
import TimeChart from "./chart/time/TimeChart";
import Header from "./header/Header";
import DistributionMap from "./chart/distribution/DistributionMap";
import AgeChart from "./chart/age/AgeChart";
import MuiAlert from "@material-ui/lab/Alert";
import GlobalList from "./chart/list/GlobalList";
import { mainService } from "./shared/service/main.service";
import ResidenceBarChart from "./chart/residence/ResidenceBarChart";
import DailyTimeChart from "./chart/time/DailyTimeChart";

const App: React.FC = () => {
  const residenceMapRef: any = useRef();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));
  const [data, setData] = useState<any>();
  const [cases, setCases] = useState([]);
  const [historicalCases, setHistoricalCases] = useState<any>();

  const Alert = (props: any) => {
    return <MuiAlert variant="outlined" {...props} />;
  };

  useEffect(() => {
    const requests = [
      mainService.getSummary(),
      mainService.getHistorical(),
      mainService.getPHCases(),
    ];
    Promise.all(requests).then((response: any) => {
      setData({
        summary: response[0].data[0],
        historical: response[1].data.timeline,
      });
      setCases(response[2]);
      setHistoricalCases({
        summary: response[0].data[0],
        historical: response[1].data.timeline,
        cases: response[2],
      });
      /* In case the summary endpoint has problem */
      // const summary = {
      //   totalConfirmed: 6087,
      //   totalRecovered: 516,
      //   totalDeaths: 397,
      // };
      // setData({
      //   summary: summary,
      //   historical: response[0].data.timeline,
      // });
      // setCases(response[1]);
      // setHistoricalCases({
      //   summary: summary,
      //   historical: response[0].data.timeline,
      //   cases: response[1],
      // });
    });
  }, []);

  return (
    <div className="App">
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AppBar position="sticky">
          <Toolbar style={{ paddingRight: "10px" }}>
            <Typography variant="h6" style={{ width: "100%" }}>
              <Header />
            </Typography>
          </Toolbar>
        </AppBar>
        <main className="container">
          <Grid container spacing={3}>
            {/* <Grid item xs={12}>
              <Alert severity="error">
                Due to unavailability of data from official sources, some charts
                will have empty data.
              </Alert>
            </Grid> */}
            <Summary data={data} />
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <AppCard
                    title="Confirmed Cases by Time"
                    style={{
                      height: "630px",
                      content: {
                        height: "calc(100% - 60px)",
                      },
                    }}
                    content={<DailyTimeChart data={historicalCases} />}
                  ></AppCard>
                  {/* <Grid item xs={12}>
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
                          height: "500px",
                          content: {
                            paddingTop: 0,
                          },
                        }}
                        content={
                          <ResidenceChart
                            ref={residenceMapRef}
                            containerId="residence-chart"
                          />
                        }
                      ></AppCard>
                    </Grid> */}
                </Grid>
                <Grid item xs={12} md={6}>
                  <AppCard
                    title="Local Cases"
                    style={{
                      height: "630px",
                      content: {
                        position: "relative",
                        height: "calc(100% - 76px)",
                        padding: "0 10px 16px 10px",
                        overflow: "auto",
                        marginBottom: "16px",
                      },
                    }}
                    content={<ResidenceBarChart data={cases} />}
                  ></AppCard>
                  {/* <Grid item xs={12}>
                      <AppCard
                        id="distribution-map"
                        title="Confirmed Cases Distribution"
                        style={{
                          height: matches ? "800px" : "1024px",
                          content: {
                            height: "calc(100% - 60px)",
                            paddingTop: 0,
                          },
                        }}
                        content={
                          <DistributionMap containerId="distribution-map" />
                        }
                      ></AppCard>
                    </Grid> */}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <AppCard
                    title="Confirmed Cases by Age Group"
                    style={{
                      height: "630px",
                    }}
                    content={<AgeChart data={cases} />}
                  ></AppCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <AppCard
                    title="Global Cases"
                    style={{
                      height: "630px",
                      content: {
                        height: "calc(100% - 76px)",
                        padding: "0 10px 16px 10px",
                        overflow: "auto",
                        marginBottom: "16px",
                      },
                    }}
                    content={<GlobalList />}
                  ></AppCard>
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
