import React, { useRef, useEffect } from "react";
import Chart, { InteractionMode } from "chart.js";
import moment from "moment";
import AppProgress from "../../shared/component/progress/AppProgress";
import { PHCase } from "../../shared/service/main.service";

interface Props {
  data: PHCase[] | undefined;
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

  const createMetric = () => {
    return {
      confirmed: 0,
      recovered: 0,
      death: 0,
    };
  };

  useEffect(() => {
    const cutoff = Date.parse("03/01/2020");
    if (props.data) {
      // Daily cases
      const dailyMap = {};
      const sameRemConfDate: any = [];
      props.data.forEach((d: PHCase) => {
        const confDate = moment(new Date(d.DateRepConf)).format("M/D/YYYY");
        const repRemDate = moment(new Date(d.DateRepRem)).format("M/D/YYYY");
        if (d.RemovalType === "Died") {
          if (!dailyMap[repRemDate]) {
            dailyMap[repRemDate] = createMetric();
          }
          dailyMap[repRemDate].death = dailyMap[repRemDate].death + 1;
        } else if (d.RemovalType === "Recovered") {
          if (!dailyMap[repRemDate]) {
            dailyMap[repRemDate] = createMetric();
          }
          dailyMap[repRemDate].recovered = dailyMap[repRemDate].recovered + 1;
        }
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
              .find(
                (d: any) => d.label.toLowerCase() === recovered.toLowerCase()
              )
              .data.push({
                x: new Date(date),
                y: lastRecovered + dailyMap[date].recovered,
              });
          }
          lastRecovered = lastRecovered + dailyMap[date].recovered;
          if (new Date(date).getTime() >= cutoff) {
            dataset
              .find((d: any) => d.label.toLowerCase() === deaths.toLowerCase())
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
              .find(
                (d: any) => d.label.toLowerCase() === confirmed.toLowerCase()
              )
              .data.push({
                x: new Date(date),
                y: totalConfirmed,
              });
          }
          lastConfirmed = totalConfirmed;
          if (new Date(date).getTime() >= cutoff) {
            dataset
              .find((d: any) => d.label === "Daily Confirmed")
              .data.push({
                x: new Date(date),
                y: dailyMap[date].confirmed,
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
          }
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
