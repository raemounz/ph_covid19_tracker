import React, { useEffect, useState } from "react";
import "./App.scss";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  ThemeProvider,
  Grid,
} from "@material-ui/core";
import theme from "./shared/theme";
import Header from "./header/Header";
import GlobalList from "./chart/list/GlobalList";
// eslint-disable-next-line no-unused-vars
import { mainService, PHCase } from "./shared/service/main.service";
import ResidenceBarChart from "./chart/residence/ResidenceBarChart";
import html2canvas from "html2canvas";
import MainSummary from "./summary/MainSummary";
import MainAgeChart from "./chart/age/MainAgeChart";
import { readString } from "react-papaparse";

const App: React.FC = () => {
  const date = `${process.env.REACT_APP_DATA_DATE}`;
  const [data, setData] = useState<PHCase[]>();

  useEffect(() => {
    mainService
      .getPHCases(`${process.env.REACT_APP_DATA_URL_SECURED}`)
      .then((response: any) => processData(response.data))
      .catch(() => {
        // This is a workaround if the triggered heroku site is http instead of https
        mainService
          .getPHCases(`${process.env.REACT_APP_DATA_URL}`)
          .then((response: any) => processData(response.data));
      });
  }, []);

  const processData = (data: any) => {
    const cases: any = readString(data, { header: true });
    setData(cases.data);
  };

  const takeScreenshot = (id: string) => {
    const element = document.getElementById(id) as HTMLElement;
    html2canvas(element).then((canvas) => {
      const dataUrl = canvas.toDataURL();
      const win: any = window.open();
      win.document.write(
        '<iframe src="' +
          dataUrl +
          '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;"></iframe>'
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
              <MainSummary
                data={data}
                date={date}
                takeScreenshot={takeScreenshot}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <ResidenceBarChart data={data} />
                </Grid>
                <MainAgeChart data={data} />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <GlobalList />
            </Grid>
          </Grid>
        </main>
      </ThemeProvider>
    </div>
  );
};

export default App;
