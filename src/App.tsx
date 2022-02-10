import React from "react";
import { AppBar, CssBaseline, Grid, Toolbar, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import html2canvas from "html2canvas";

import "./App.css";
import theme from "./shared/theme";
import Header from "./header/Header";
import GlobalList from "./chart/list/GlobalList";
import ResidenceBarChart from "./chart/residence/ResidenceBarChart";
import MainSummary from "./summary/MainSummary";
import MainAgeChart from "./chart/age/MainAgeChart";

const App: React.FC = () => {
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
              <Header />
            </Typography>
          </Toolbar>
        </AppBar>
        <main className="container">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MainSummary takeScreenshot={takeScreenshot} />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <ResidenceBarChart />
                </Grid>
                <MainAgeChart />
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
