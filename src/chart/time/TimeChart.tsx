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
            beginAtZero: true
          }
        }
      ],
      xAxes: [
        {
          type: "time",
          ticks: {
            beginAtZero: true,
            callback: (value: any) => {
              const date = Date.parse(value);
              return !isNaN(date) ? moment(date).format("MMM DD") : value;
            }
          }
        }
      ]
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
            label = ` ${capitalize(label)}: ${tooltipItem.yLabel.toLocaleString()}`;
          }
          return label;
        }
      }
    }
  };

  const dataset: any = [
    {
      label: capitalize(confirmed),
      fill: false,
      borderColor: "#ff5500",
      backgroundColor: "#ff5500",
      data: []
    },
    {
      label: capitalize(recovered),
      fill: false,
      borderColor: "#38a800",
      backgroundColor: "#38a800",
      data: []
    },
    {
      label: capitalize(deaths),
      borderColor: "#464646",
      backgroundColor: "#464646",
      fill: false,
      data: []
    }
  ];

  useEffect(() => {
    const requests = [
      mainService.getConfirmedCasesTrends(),
      mainService.getHistorical()
    ];
    Promise.all(requests).then((response: any) => {
      response[0].data.features.forEach((d: any) => {
        dataset
          .find(d => d.label.toLowerCase() === recovered.toLowerCase())
          ?.data.push({
            x: new Date(d.attributes.date),
            y: d.attributes[recovered]
          });
        dataset
          .find(d => d.label.toLowerCase() === deaths.toLowerCase())
          ?.data.push({
            x: new Date(d.attributes.date),
            y: d.attributes[deaths]
          });
      });
      const cases = response[1].data.timeline.cases;
      Object.keys(cases).forEach((c: any) => {
        dataset
          .find(d => d.label.toLowerCase() === confirmed.toLowerCase())
          ?.data.push({
            x: new Date(c),
            y: cases[c]
          });
      });
      setIsLoading(false);
      const canvas: HTMLCanvasElement = chartRef.current as HTMLCanvasElement;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      chart = new Chart(canvas, {
        type: "line",
        data: {
          datasets: dataset
        },
        options: option
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
