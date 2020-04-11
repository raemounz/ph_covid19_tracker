import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js";
import { mainService } from "../../shared/service/main.service";
import moment from "moment";
import AppProgress from "../../shared/component/progress/AppProgress";

const TimeChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  let chart: Chart;
  const [isLoading, setIsLoading] = useState(true);
  const confirmed = "confirmed";
  const recovered = "recovered";
  const deaths = "deaths";

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
      borderColor: "#ff5500",
      backgroundColor: "#ff5500",
      data: [],
    },
    {
      label: capitalize(recovered),
      fill: false,
      borderColor: "#38a800",
      backgroundColor: "#38a800",
      data: [],
    },
    {
      label: capitalize(deaths),
      borderColor: "#464646",
      backgroundColor: "#464646",
      fill: false,
      data: [],
    },
  ];

  useEffect(() => {
    const requests = [
      /* Old API not working */
      // mainService.getConfirmedCasesTrends(),
      // mainService.getHistorical(),
      // mainService.getConfirmedCases()
      mainService.getSummary(),
      mainService.getHistorical(),
    ];
    Promise.all(requests).then((response: any) => {
      const recoveredSet = dataset.find(
        (d: any) => d.label.toLowerCase() === recovered.toLowerCase()
      );
      const deathSet = dataset.find(
        (d: any) => d.label.toLowerCase() === deaths.toLowerCase()
      );
      const confirmedSet = dataset.find(
        (d: any) => d.label.toLowerCase() === confirmed.toLowerCase()
      );
      /* Old API not working */
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
      let lastDate: any;
      let lastConfirmed: any;
      const cases = response[1].data.timeline.cases;
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
      const casesRecovered = response[1].data.timeline.recovered;
      Object.keys(cases).forEach((c: any) => {
        const d = {
          x: new Date(c),
          y: casesRecovered[c],
        };
        recoveredSet.data.push(d);
        lastRecovered = d;
      });
      let lastDeath: any;
      const casesDeath = response[1].data.timeline.deaths;
      Object.keys(cases).forEach((c: any) => {
        const d = {
          x: new Date(c),
          y: casesDeath[c],
        };
        deathSet.data.push(d);
        lastDeath = d;
      });
      // Compute the new cases
      const totalConfirmed = response[0].data[0].totalConfirmed;
      const totalRecovered = response[0].data[0].totalRecovered;
      const totalDeaths = response[0].data[0].totalDeaths;
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

      setIsLoading(false);
      const canvas: HTMLCanvasElement = chartRef.current as HTMLCanvasElement;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      chart = new Chart(canvas, {
        type: "line",
        data: {
          datasets: dataset,
        },
        options: option,
      });
      chart.update();
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <AppProgress />
      ) : (
        <canvas ref={chartRef} style={{ height: "100% !important" }}></canvas>
      )}
    </>
  );
};

export default TimeChart;
