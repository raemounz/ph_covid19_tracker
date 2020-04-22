import React, { useRef, useEffect } from "react";
import Chart, { InteractionMode } from "chart.js";
import moment from "moment";
import AppProgress from "../../shared/component/progress/AppProgress";

interface Props {
  data: any;
}

const DailyTimeChart: React.FC<Props> = (props: Props) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  let chart: Chart;
  const confirmed = "confirmed";
  const recovered = "recovered";
  const deaths = "deaths";
  const tooltipMode: InteractionMode = "index";

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
          position: "left",
          stacked: true,
        },
        {
          id: "cumulative-axis",
          type: "linear",
          position: "right",
        },
      ],
      xAxes: [
        {
          type: "time",
          stacked: true,
          offset: true,
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
      label: capitalize(confirmed),
      fill: false,
      lineTension: 0,
      pointStyle: "circle",
      pointRadius: 0,
      borderWidth: 4,
      borderColor: "#ff5500",
      backgroundColor: "#ff5500",
      data: [],
      yAxisID: "cumulative-axis",
      type: "line",
    },
    {
      label: capitalize(recovered),
      fill: false,
      lineTension: 0,
      pointStyle: "circle",
      pointRadius: 0,
      borderWidth: 4,
      borderColor: "#38a800",
      backgroundColor: "#38a800",
      data: [],
      yAxisID: "cumulative-axis",
      type: "line",
    },
    {
      label: capitalize(deaths),
      fill: false,
      lineTension: 0,
      pointStyle: "circle",
      pointRadius: 0,
      borderWidth: 4,
      borderColor: "#464646",
      backgroundColor: "#464646",
      data: [],
      yAxisID: "cumulative-axis",
      type: "line",
    },
    {
      label: "Daily Confirmed",
      backgroundColor: "rgba(255, 190, 157, .6)",
      data: [],
      yAxisID: "daily-axis",
    },
    {
      label: "Daily Recovered",
      backgroundColor: "rgba(56, 168, 0, .6)",
      data: [],
      yAxisID: "daily-axis",
    },
    {
      label: "Daily Deaths",
      backgroundColor: "rgba(70, 70, 70, .6)",
      data: [],
      yAxisID: "daily-axis",
    },
  ];

  useEffect(() => {
    const cutoff = Date.parse("03/01/2020");
    if (props.data) {
      const recoveredSet = dataset.find(
        (d: any) => d.label.toLowerCase() === recovered.toLowerCase()
      );
      const deathSet = dataset.find(
        (d: any) => d.label.toLowerCase() === deaths.toLowerCase()
      );
      const confirmedSet = dataset.find(
        (d: any) => d.label.toLowerCase() === confirmed.toLowerCase()
      );
      let lastDate: any;
      let lastConfirmed: any;
      const cases = props.data.historical.cases;
      Object.keys(cases)
        .filter((c: any) => new Date(c).getTime() >= cutoff)
        .forEach((c: any) => {
          const d = {
            x: new Date(c),
            y: cases[c],
          };
          confirmedSet.data.push(d);
          lastConfirmed = d;
          lastDate = new Date(c);
        });
      let lastRecovered: any;
      const casesRecovered = props.data.historical.recovered;
      Object.keys(cases)
        .filter((c: any) => new Date(c).getTime() >= cutoff)
        .forEach((c: any) => {
          const d = {
            x: new Date(c),
            y: casesRecovered[c],
          };
          recoveredSet.data.push(d);
          lastRecovered = d;
        });
      let lastDeath: any;
      const casesDeath = props.data.historical.deaths;
      Object.keys(cases)
        .filter((c: any) => new Date(c).getTime() >= cutoff)
        .forEach((c: any) => {
          const d = {
            x: new Date(c),
            y: casesDeath[c],
          };
          deathSet.data.push(d);
          lastDeath = d;
        });
      // Compute the new cases
      const totalConfirmed = props.data.summary.totalConfirmed;
      const totalRecovered = props.data.summary.totalRecovered;
      const totalDeaths = props.data.summary.totalDeaths;
      let newCase = {
        confirmed: 0,
        recovered: 0,
        deaths: 0,
      };
      let hasNewCase = false;
      const latestDate = moment(lastDate).add(1, "day").toDate();
      if (totalConfirmed > lastConfirmed.y) {
        newCase.confirmed = totalConfirmed - lastConfirmed.y;
        hasNewCase = true;
        confirmedSet.data.push({
          x: latestDate,
          y: totalConfirmed,
        });
      }
      if (totalRecovered > lastRecovered.y) {
        newCase.recovered = totalRecovered - lastRecovered.y;
        hasNewCase = true;
        recoveredSet.data.push({
          x: latestDate,
          y: totalRecovered,
        });
      }
      if (totalDeaths > lastDeath.y) {
        newCase.deaths = totalDeaths - lastDeath.y;
        hasNewCase = true;
        deathSet.data.push({
          x: latestDate,
          y: totalDeaths,
        });
      }

      // Daily cases
      const dailyMap = {};
      dataset[0].data.forEach(
        (c: any) =>
          (dailyMap[moment(c.x).format("M/D/YYYY")] = {
            active: 0,
            recovered: 0,
            death: 0,
          })
      );
      props.data.cases.forEach((d: any) => {
        if (
          d.RemovalType === "Died" &&
          new Date(d.DateRepRem).getTime() >= cutoff
        ) {
          dailyMap[d.DateRepRem].death = dailyMap[d.DateRepRem].death + 1;
        } else if (
          d.RemovalType === "Recovered" &&
          new Date(d.DateRepRem).getTime() >= cutoff
        ) {
          dailyMap[d.DateRepRem].recovered =
            dailyMap[d.DateRepRem].recovered + 1;
        } else if (Date.parse(d.DateRepConf) >= cutoff) {
          const confDate = moment(new Date(d.DateRepConf)).format("M/D/YYYY");
          dailyMap[confDate].active = dailyMap[confDate].active + 1;
        }
      });
      if (hasNewCase) {
        dailyMap[moment(latestDate).format("M/D/YYYY")] = {
          active: newCase.confirmed,
          recovered: newCase.recovered,
          death: newCase.deaths,
        };
      }
      Object.keys(dailyMap)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .forEach((date: string) => {
          dataset
            .find((d: any) => d.label === "Daily Confirmed")
            .data.push({
              x: new Date(date),
              y: dailyMap[date].active,
            });
          dataset
            .find((d: any) => d.label === "Daily Recovered")
            .data.push({
              x: new Date(date),
              y: dailyMap[date].recovered,
            });
          dataset
            .find((d: any) => d.label === "Daily Deaths")
            .data.push({
              x: new Date(date),
              y: dailyMap[date].death,
            });
        });

      const canvas: HTMLCanvasElement = chartRef.current as HTMLCanvasElement;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      chart = new Chart(canvas, {
        type: "bar",
        data: {
          datasets: dataset,
        },
        options: option,
      });
      chart.update();
    }
  }, [props.data]);

  return (
    <>
      {!props.data && <AppProgress />}
      <canvas ref={chartRef} style={{ height: "100% !important" }}></canvas>
    </>
  );
};

export default DailyTimeChart;
