/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import Chart, { ChartOptions } from "chart.js/auto";
import "chartjs-adapter-moment";
import moment from "moment";

import AppProgress from "../../shared/component/progress/AppProgress";
import { CaseType, mainService } from "../../shared/service/main.service";
import { Constants } from "../../shared/Constants";

interface Props {
  caseType: CaseType;
  regionCity: any;
}

const DailyTimeChart: React.FC<Props> = (props: Props) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chart, setChart] = useState<Chart>();

  const [caseType, setCaseType] = useState<any>(CaseType.Confirmed);
  const [regionCity, setRegionCity] = useState<any>({
    region: Constants.allRegions,
    city: Constants.allCities,
  });
  const [inProgress, setInProgress] = useState(true);
  const [data, setData] = useState<any>([]);

  const DailyActive = "Daily Active";
  const DailyConfirmed = "Daily Confirmed";
  const DailyRecovered = "Daily Recovered";
  const DailyDeaths = "Daily Deaths";
  const caseMap = {
    ACTIVE: DailyActive,
    CONFIRMED: DailyConfirmed,
    RECOVERED: DailyRecovered,
    DEATHS: DailyDeaths,
    "TOTAL ACTIVE": CaseType.Active,
    "TOTAL RECOVERED": CaseType.Recovered,
    "TOTAL DEATHS": CaseType.Deaths,
    "TOTAL CONFIRMED": CaseType.Confirmed,
  };

  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const option: ChartOptions | any = {
    maintainAspectRatio: false,
    scales: {
      "daily-axis": {
        type: "linear",
        position: "right",
        stacked: true,
        title: {
          display: true,
          text: "Daily",
        },
        display: true,
        min: 0,
        beginAtZero: true,
        ticks: {
          precision: 0,
          maxTicksLimit: 25,
        },
      },
      "cumulative-axis": {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Cummulative",
        },
        display: true,
        min: 0,
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
      x: {
        type: "time",
        display: true,
        stacked: true,
        offset: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          title: (tooltipItems: any) => {
            const date = Date.parse(tooltipItems[0].label);
            return moment(date).format("LL");
          },
          label: (tooltipItem: any) => {
            let label = tooltipItem.dataset.label;
            if (label) {
              label = ` ${capitalize(
                label
              )}: ${tooltipItem.parsed.y.toLocaleString()}`;
            }
            return label;
          },
        },
      },
    },
  };

  const dataset: any = [
    {
      label: CaseType.Active,
      fill: false,
      lineTension: 0,
      pointStyle: "circle",
      pointRadius: 0,
      borderWidth: 4,
      borderColor: Constants.activeColor,
      backgroundColor: Constants.activeColor,
      data: [],
      yAxisID: "cumulative-axis",
      type: "line",
    },
    {
      label: CaseType.Confirmed,
      fill: false,
      lineTension: 0,
      pointStyle: "circle",
      pointRadius: 0,
      borderWidth: 4,
      borderColor: Constants.confirmedColor,
      backgroundColor: Constants.confirmedColor,
      data: [],
      yAxisID: "cumulative-axis",
      type: "line",
    },
    {
      label: CaseType.Recovered,
      fill: false,
      lineTension: 0,
      pointStyle: "circle",
      pointRadius: 0,
      borderWidth: 4,
      borderColor: Constants.recoveredColor,
      backgroundColor: Constants.recoveredColor,
      data: [],
      yAxisID: "cumulative-axis",
      type: "line",
    },
    {
      label: CaseType.Deaths,
      fill: false,
      lineTension: 0,
      pointStyle: "circle",
      pointRadius: 0,
      borderWidth: 4,
      borderColor: Constants.deathColor,
      backgroundColor: Constants.deathColor,
      data: [],
      yAxisID: "cumulative-axis",
      type: "line",
    },
    {
      label: DailyActive,
      backgroundColor: Constants.activeColor,
      data: [],
      yAxisID: "daily-axis",
    },
    {
      label: DailyConfirmed,
      backgroundColor: Constants.dailyConfirmedColor,
      data: [],
      yAxisID: "daily-axis",
    },
    {
      label: DailyRecovered,
      backgroundColor: Constants.dailyRecoveredColor,
      data: [],
      yAxisID: "daily-axis",
    },
    {
      label: DailyDeaths,
      backgroundColor: Constants.dailyDeathColor,
      data: [],
      yAxisID: "daily-axis",
    },
  ];

  useEffect(() => {
    if (props.regionCity) {
      setRegionCity(props.regionCity);
    }
  }, [props.regionCity]);

  useEffect(() => {
    let _chart;
    if (!chart) {
      const canvas: HTMLCanvasElement = chartRef.current as HTMLCanvasElement;
      _chart = new Chart(canvas, {
        type: "bar",
        data: {
          datasets: dataset,
        },
        options: option,
      });
      setChart(_chart);
    }
    setInProgress(true);
    mainService
      .getTimeseries(
        regionCity.region === Constants.allRegions ? "" : regionCity.region,
        regionCity.city === Constants.allCities ? "" : regionCity.city
      )
      .then((response: any) => {
        // Clear dataset data
        dataset.forEach((d: any) => (d.data = []));
        response.data.forEach((d: any) => {
          const date = new Date(d.date);
          d.cases.forEach((c: any) => {
            dataset
              .find((ds: any) => ds.label === caseMap[c.case])
              .data.push({
                x: date,
                y: c.count,
              });
          });
        });
        setData(dataset);
        filterDataset(caseType, _chart || chart, dataset);
        setInProgress(false);
      });
  }, [regionCity]);

  useEffect(() => {
    setCaseType(props.caseType);
    if (!inProgress) {
      filterDataset(props.caseType, chart, data);
    }
  }, [props.caseType]);

  const filterDataset = (_caseType: CaseType, _chart, _dataset: any[]) => {
    _chart.data.datasets = _dataset.filter((ds: any) => {
      if (_caseType === CaseType.Confirmed) {
        return [CaseType.Active, CaseType.Confirmed, DailyConfirmed].includes(
          ds.label
        );
      } else if (_caseType === CaseType.Recovered) {
        return [CaseType.Recovered, DailyRecovered].includes(ds.label);
      } else if (_caseType === CaseType.Deaths) {
        return [CaseType.Deaths, DailyDeaths].includes(ds.label);
      } else {
        return ds.label !== DailyActive;
      }
    });
    _chart.update();
  };

  return (
    <>
      {inProgress && <AppProgress />}
      <div
        style={{
          display: inProgress ? "none" : "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: 608 }}>
          <canvas
            ref={chartRef}
            style={{ height: "100% !important", flexGrow: 1 }}
          ></canvas>
        </div>
      </div>
    </>
  );
};

export default DailyTimeChart;
