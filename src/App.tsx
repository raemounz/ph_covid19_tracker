import React, { useEffect, useState } from "react";
import "./App.scss";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  ThemeProvider,
  Grid,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import theme from "./shared/theme";
import AppCard from "./shared/component/card/AppCard";
import Header from "./header/Header";
import GlobalList from "./chart/list/GlobalList";
import { mainService, PHCase } from "./shared/service/main.service";
import ResidenceBarChart from "./chart/residence/ResidenceBarChart";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import html2canvas from "html2canvas";
import MainSummary from "./summary/MainSummary";
import MainAgeChart from "./chart/age/MainAgeChart";
import { readString } from "react-papaparse";

const App: React.FC = () => {
  const date = "2020-09-04";
  // const securedUrl = "http://localhost:3000";
  const url = "http://covid19ph-tracker.herokuapp.com";
  const securedUrl = "https://covid19ph-tracker.herokuapp.com";
  const [data, setData] = useState<PHCase[]>();

  useEffect(() => {
    mainService.getPHCases(securedUrl).then((response: any) => {
      const cases: any = readString(response.data, { header: true });
      setData(cases.data);
    }).catch(() => {
      mainService.getPHCases(url).then((response: any) => {
        const cases: any = readString(response.data, { header: true });
        setData(cases.data);
      })
    });
  }, []);

  const takeScreenshot = (id: string) => {
    const element = document.getElementById(id) as HTMLElement;
    html2canvas(element).then((canvas) => {
      const dataUrl = canvas.toDataURL();
      const win: any = window.open();
      win.document.write(
        '<iframe src="' +
          dataUrl +
          '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
      );
    });
  };

  return (
    <div className="App">
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AppBar position="sticky">
          <Toolbar style={{ paddingRight: "10px" }}>
            <Typography variant="h6" style={{ width: "100%" }}>
              <Header date={date} />
            </Typography>
          </Toolbar>
        </AppBar>
        <main className="container">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MainSummary data={data} date={date} />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <AppCard
                    id="localCases"
                    title="Local Cases (Top 30 Cities)"
                    style={{
                      height: "600px",
                      content: {
                        position: "relative",
                        height: "calc(100% - 76px)",
                        padding: "0 16px",
                        overflow: "auto",
                      },
                    }}
                    action={
                      <Tooltip title="Take a screenshot">
                        <IconButton
                          onClick={() => takeScreenshot("localCases")}
                        >
                          <CameraAltIcon />
                        </IconButton>
                      </Tooltip>
                    }
                    content={<ResidenceBarChart data={data} />}
                  ></AppCard>
                </Grid>
                <MainAgeChart data={data} />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <AppCard
                id="globalCases"
                title="Global Cases"
                style={{
                  height: "588px",
                  content: {
                    height: "calc(100% - 60px)",
                    paddingTop: 0,
                  },
                }}
                content={<GlobalList />}
              ></AppCard>
            </Grid>
          </Grid>
        </main>
      </ThemeProvider>
    </div>
  );
};

export default App;
