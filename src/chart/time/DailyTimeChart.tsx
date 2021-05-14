/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import Chart, { InteractionMode } from "chart.js";
import moment from "moment";
import AppProgress from "../../shared/component/progress/AppProgress";
import { CaseType } from "../../shared/service/main.service";
import { Constants } from "../../shared/Constants";

interface Props {
  data?: any;
  caseType: CaseType;
  regionCity: any;
}

const DailyTimeChart: React.FC<Props> = (props: Props) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chart, setChart] = useState<Chart>();
  const tooltipMode: InteractionMode = "index";
  const cutoff = Date.parse("02/01/2020");
  
  const dateFormat = "M/D/YY";
  const [filteredCaseData, setFilteredCaseData] = useState<any>(undefined);
  const DailyConfirmed = "Daily Confirmed";
  const DailyRecovered = "Daily Recovered";
  const DailyDeaths = "Daily Deaths";

  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const option = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          id: "daily-axis",
          type: "linear",
          position: "right",
          stacked: true,
          scaleLabel: {
            labelString: "Daily",
            display: true,
          },
          ticks: {
            beginAtZero: true,
            precision: 0,
            min: 0,
            maxTicksLimit: 25,
          },
        },
        {
          id: "cumulative-axis",
          type: "linear",
          position: "right",
          scaleLabel: {
            labelString: "Cummulative",
            display: true,
          },
          ticks: {
            beginAtZero: true,
            precision: 0,
            min: 0,
          },
        },
      ],
      xAxes: [
        {
          type: "time",
          stacked: true,
          offset: true,
          gridLines: {
            display: false,
          },
        },
      ],
    },
    tooltips: {
      mode: tooltipMode,
      intersect: false,
      callbacks: {
        title: (tooltipItem: any) => {
          const date = Date.parse(tooltipItem[0].label);
          return moment(date).format("ll");
        },
        label: (tooltipItem: any, data: any) => {
          let label = data.datasets[tooltipItem.datasetIndex].label || "";
          if (label) {
            label = ` ${capitalize(
              label
            )}: ${tooltipItem.yLabel.toLocaleString()}`;
          }
          return label;
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

  const createMetric = () => {
    return {
      confirmed: 0,
      recovered: 0,
      death: 0,
    };
  };

  useEffect(() => {

  }, [props.regionCity]);

  useEffect(() => {
    if (props.data?.data) {
      // Regions and Provinces
      // const regMap = {};
      // props.data.data.forEach((d: any) => {
      //   const region = `${d.RegionRes}` || Constants.forValidation;
      //   if (!regMap[region]) {
      //     regMap[region] = new Set();
      //   }
      //   regMap[region].add(d.CityMunRes || Constants.forValidation);
      // });
      // setRegionMap(regMap);

      if (!chart) {
        const canvas: HTMLCanvasElement = chartRef.current as HTMLCanvasElement;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const _chart = new Chart(canvas, {
          type: "bar",
          data: {
            datasets: dataset,
          },
          options: option,
        });
        setChart(_chart);
        populateDataset(_chart, props.data.data, "province", "city");
      } else {
        populateDataset(undefined, props.data.data, "province", "city");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  const populateDataset = (
    _chart: Chart | undefined,
    data: any[] | undefined,
    _province: string,
    _city: string
  ) => {
    if (data) {
      // Daily cases
      const dailyMap = {};
      const sameRemConfDate: any = [];
      let filteredData: any[];

      // Clear chart data
      dataset.forEach((d: any) => (d.data = []));

      if (_province === Constants.allRegions) {
        if (_city === Constants.allCities) {
          filteredData = data.filter(
            (d: any) => `${d.RegionRes}` !== _province && d.CityMunRes !== _city
          );
        } else {
          filteredData = data.filter(
            (d: any) =>
              `${d.RegionRes}` !== _province &&
              (d.CityMunRes || Constants.forValidation) === _city
          );
        }
      } else {
        if (_city === Constants.allCities) {
          filteredData = data.filter(
            (d: any) =>
              (`${d.RegionRes}` || Constants.forValidation) === _province &&
              d.CityMunRes !== _city
          );
        } else {
          filteredData = data.filter(
            (d: any) =>
              (`${d.RegionRes}` || Constants.forValidation) === _province &&
              (d.CityMunRes || Constants.forValidation) === _city
          );
        }
      }
      filteredData.forEach((d: any) => {
        const confDate = moment(
          new Date(
            d.DateRepConf ||
              d.DateResultRelease ||
              d.DateSpecimen ||
              d.DateOnset
          )
        ).format(dateFormat);
        // if (d.RemovalType === RemovalType.Died) {
        //   const diedDate = moment(new Date(d.DateDied || d.DateRepConf)).format(
        //     dateFormat
        //   );
        //   if (!dailyMap[diedDate]) {
        //     dailyMap[diedDate] = createMetric();
        //   }
        //   dailyMap[diedDate].death = dailyMap[diedDate].death + 1;
        // } else if (d.RemovalType === RemovalType.Recovered) {
        //   const recoveredDate = moment(
        //     new Date(d.DateRecover || d.DateRepConf)
        //   ).format(dateFormat);
        //   if (!dailyMap[recoveredDate]) {
        //     dailyMap[recoveredDate] = createMetric();
        //   }
        //   dailyMap[recoveredDate].recovered =
        //     dailyMap[recoveredDate].recovered + 1;
        // }
        if (!dailyMap[confDate]) {
          dailyMap[confDate] = createMetric();
        }
        dailyMap[confDate].confirmed = dailyMap[confDate].confirmed + 1;
      });

      let lastConfirmed = 0;
      let lastRecovered = 0;
      let lastDeath = 0;
      Object.keys(dailyMap)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .forEach((date: string) => {
          if (new Date(date).getTime() >= cutoff) {
            dataset
              .find((d: any) => d.label === CaseType.Recovered)
              .data.push({
                x: new Date(date),
                y: lastRecovered + dailyMap[date].recovered,
              });
          }
          lastRecovered = lastRecovered + dailyMap[date].recovered;
          if (new Date(date).getTime() >= cutoff) {
            dataset
              .find((d: any) => d.label === CaseType.Deaths)
              .data.push({
                x: new Date(date),
                y: lastDeath + dailyMap[date].death,
              });
          }
          lastDeath = lastDeath + dailyMap[date].death;
          let totalConfirmed = lastConfirmed + dailyMap[date].confirmed;
          if (sameRemConfDate.includes(date)) {
            totalConfirmed =
              totalConfirmed + dailyMap[date].recovered + dailyMap[date].death;
          }
          if (new Date(date).getTime() >= cutoff) {
            dataset
              .find((d: any) => d.label === CaseType.Confirmed)
              .data.push({
                x: new Date(date),
                y: totalConfirmed,
              });
          }
          lastConfirmed = totalConfirmed;
          if (new Date(date).getTime() >= cutoff) {
            dataset
              .find((d: any) => d.label === DailyConfirmed)
              .data.push({
                x: new Date(date),
                y: dailyMap[date].confirmed,
              });
            dataset
              .find((d: any) => d.label === DailyRecovered)
              .data.push({
                x: new Date(date),
                y: dailyMap[date].recovered,
              });
            dataset
              .find((d: any) => d.label === DailyDeaths)
              .data.push({
                x: new Date(date),
                y: dailyMap[date].death,
              });
          }
        });

      // Populate active cases
      const activeData = dataset[0].data;
      dataset[1].data.forEach((d: any) => {
        const activeRecovered = dataset[2].data.find(
          (r: any) => r.x.getTime() === d.x.getTime()
        );
        const activeDeath = dataset[3].data.find(
          (r: any) => r.x.getTime() === d.x.getTime()
        );
        activeData.push({
          x: d.x,
          y:
            d.y -
            (activeRecovered ? activeRecovered.y : 0) -
            (activeDeath ? activeDeath.y : 0),
        });
      });

      setFilteredCaseData(dataset);

      let _dataset = dataset.map((ds: any) => ds);
      if (props.data?.caseType === CaseType.Confirmed) {
        _dataset = dataset.filter((ds: any) =>
          [CaseType.Active, CaseType.Confirmed, DailyConfirmed].includes(
            ds.label
          )
        );
      } else if (props.data?.caseType === CaseType.Recovered) {
        _dataset = dataset.filter((ds: any) =>
          [CaseType.Recovered, DailyRecovered].includes(ds.label)
        );
      } else if (props.data?.caseType === CaseType.Deaths) {
        _dataset = dataset.filter((ds: any) =>
          [CaseType.Deaths, DailyDeaths].includes(ds.label)
        );
      }

      if (_chart) {
        _chart.data.datasets = _dataset;
        _chart.update();
      } else if (chart) {
        chart.data.datasets = _dataset;
        chart.update();
      }
    }
  };

  const getCaseTotal = (caseType: CaseType, data: any) => {
    const _data = data.find((d: any) => d.label === caseType).data;
    return _data[_data.length - 1].y;
  };

  // useEffect(() => {
  //   props.onChangeRegionCity({
  //     region: province,
  //     city: city,
  //   });
  // }, [province, city]);

  return (
    <>
      {!props.data?.data && <AppProgress />}
      <div
        style={{
          display: !props.data ? "none" : "flex",
          flexDirection: "column",
        }}
      >
        {" "}
        <div style={{ height: "560px" }}>
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
