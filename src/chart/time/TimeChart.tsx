import React, { useRef, useEffect } from "react";
import Chart, { InteractionMode } from "chart.js";
import moment from "moment";
import AppProgress from "../../shared/component/progress/AppProgress";
import * as ChartAnnotation from "chartjs-plugin-annotation";

interface Props {
  data: any;
}

const TimeChart: React.FC<Props> = (props: Props) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  let chart: Chart;
  const confirmed = "confirmed";
  const recovered = "recovered";
  const deaths = "deaths";
  const tooltipMode: InteractionMode = "x";

  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const option = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      xAxes: [
        {
          type: "time",
          ticks: {
            beginAtZero: true,
            callback: (value: any) => {
              const date = Date.parse(value);
              return !isNaN(date) ? moment(date).format("MMM DD") : value;
            },
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
    annotation: {
      annotations: [
        {
          type: "line",
          mode: "vertical",
          scaleID: "x-axis-0",
          value: Date.parse("30 Jan 2020"),
          borderDash: [8, 4],
          borderColor: "red",
          label: {
            content: "1st Case",
            fontFamily: "Roboto",
            enabled: true,
            xAdjust: 34,
            yAdjust: 200,
          },
        },
        {
          type: "line",
          mode: "vertical",
          scaleID: "x-axis-0",
          value: Date.parse("15 Mar 2020"),
          borderDash: [8, 4],
          borderColor: "red",
          label: {
            content: "Metro Manila Community Quarantine",
            fontFamily: "Roboto",
            enabled: true,
            xAdjust: -112,
            yAdjust: 150,
          },
        },
        {
          type: "line",
          mode: "vertical",
          scaleID: "x-axis-0",
          value: Date.parse("17 Mar 2020"),
          borderDash: [8, 4],
          borderColor: "red",
          label: {
            content: "Luzon ECQ",
            fontFamily: "Roboto",
            enabled: true,
            xAdjust: 42,
            yAdjust: 105,
          },
        },
        {
          type: "line",
          mode: "vertical",
          scaleID: "x-axis-0",
          value: Date.parse("7 Apr 2020"),
          borderDash: [8, 4],
          borderColor: "red",
          label: {
            content: "Extended Luzon ECQ",
            fontFamily: "Roboto",
            enabled: true,
            xAdjust: -69,
            yAdjust: 50,
          },
        },
      ],
    },
  };

  const dataset: any = [
    {
      label: capitalize(confirmed),
      fill: true,
      lineTension: 0,
      pointStyle: "circle",
      pointRadius: 0,
      borderColor: "#ff5500",
      backgroundColor: "rgba(255, 190, 157, .6)",
      data: [],
    },
    {
      label: capitalize(recovered),
      fill: true,
      lineTension: 0,
      pointStyle: "circle",
      pointRadius: 0,
      borderColor: "#38a800",
      backgroundColor: "#4ce300",
      data: [],
    },
    {
      label: capitalize(deaths),
      fill: true,
      lineTension: 0,
      pointStyle: "circle",
      pointRadius: 0,
      borderColor: "#464646",
      backgroundColor: "#8b8b8b",
      data: [],
    },
  ];

  useEffect(() => {
    /* Old API not working */
    // const requests = [
    // mainService.getConfirmedCasesTrends(),
    // mainService.getHistorical(),
    // mainService.getConfirmedCases()
    // ];
    // response[0].data.features.forEach((d: any) => {
    //   recoveredSet.data.push({
    //     x: new Date(d.attributes.date),
    //     y: d.attributes[recovered]
    //   });
    //   deathSet.data.push({
    //     x: new Date(d.attributes.date),
    //     y: d.attributes[deaths]
    //   });
    // });
    // const cases = response[1].data.timeline.cases;
    // Object.keys(cases).forEach((c: any) => {
    //   confirmedSet.data.push({
    //     x: new Date(c),
    //     y: cases[c]
    //   });
    // });
    // Compute the new cases (old API)
    // const totalCases = response[2].data.features[0].attributes.value;
    // const lastDeathCases = deathSet.data[deathSet.data.length - 1];
    // const lastConfCases = confirmedSet.data[confirmedSet.data.length - 1];
    // if (
    //   lastConfCases.x.setHours(0, 0, 0, 0) <
    //   lastDeathCases.x.setHours(0, 0, 0, 0)
    // ) {
    //   if (totalCases > lastConfCases.y) {
    //     confirmedSet.data.push({
    //       x: lastDeathCases.x,
    //       y: lastConfCases.y + (totalCases - lastConfCases.y)
    //     });
    //   }
    // }

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
      Object.keys(cases).forEach((c: any) => {
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
      Object.keys(cases).forEach((c: any) => {
        const d = {
          x: new Date(c),
          y: casesRecovered[c],
        };
        recoveredSet.data.push(d);
        lastRecovered = d;
      });
      let lastDeath: any;
      const casesDeath = props.data.historical.deaths;
      Object.keys(cases).forEach((c: any) => {
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
      const latestDate = moment(lastDate).add(1, "day");
      if (totalConfirmed > lastConfirmed.y) {
        confirmedSet.data.push({
          x: latestDate,
          y: totalConfirmed,
        });
      }
      if (totalRecovered > lastRecovered.y) {
        recoveredSet.data.push({
          x: latestDate,
          y: totalRecovered,
        });
      }
      if (totalDeaths > lastDeath.y) {
        deathSet.data.push({
          x: latestDate,
          y: totalDeaths,
        });
      }

      const canvas: HTMLCanvasElement = chartRef.current as HTMLCanvasElement;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      chart = new Chart(canvas, {
        type: "line",
        data: {
          datasets: dataset,
        },
        options: option,
        plugins: [ChartAnnotation],
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

export default TimeChart;
