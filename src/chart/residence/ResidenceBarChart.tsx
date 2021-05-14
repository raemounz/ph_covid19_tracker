import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js";
import AppProgress from "../../shared/component/progress/AppProgress";
import AppCard from "../../shared/component/card/AppCard";
import { mainService } from "../../shared/service/main.service";

const ResidenceBarChart: React.FC = () => {
  const [inProgress, setInProgress] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  let chart: Chart;

  const option: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          position: "top",
          ticks: {
            fontSize: 13,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            autoSkip: false,
            fontSize: 13,
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        footer: (tooltipItem: any) => {
          return `Total: ${tooltipItem
            .filter((item: any) => item.datasetIndex > 0)
            .reduce((a: any, b: any) => a + Number(b.value), 0)}`;
        },
      },
    },
  };

  const data = {
    ACTIVE: {
      data: [],
      backgroundColor: "#f6b44e",
      label: "Active",
      stack: "active",
    },
    ADMITTED: {
      data: [],
      backgroundColor: "#df734f",
      label: "Admitted",
      stack: "cases",
    },
    RECOVERED: {
      data: [],
      backgroundColor: "#bfa37e",
      label: "Recovered",
      stack: "cases",
    },
    DEATHS: {
      data: [],
      backgroundColor: "#4b4743",
      label: "Deaths",
      stack: "cases",
    },
    "NOT ADMITTED": {
      data: [],
      backgroundColor: "rgba(223, 115, 79, .6)",
      label: "Not Admitted",
      stack: "cases",
    },
  };

  useEffect(() => {
    setInProgress(true);
    mainService.getTop30Cities().then((response: any) => {
      const labels: string[] = [];
      response.data.forEach((d: any) => {
        labels.push(d.city);
        d.cases
          .filter((c: any) => c.case !== "TOTAL")
          .forEach((c: any) => data[c.case].data.push(c.count));
      });
      const datasets = Object.keys(data).map((c: any) => data[c]);

      const canvas: HTMLCanvasElement = chartRef.current as HTMLCanvasElement;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      chart = new Chart(canvas, {
        type: "horizontalBar",
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: option,
      });
      chart.update();
      setInProgress(false);
    });
  }, []);

  return (
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
      content={
        <div style={{ height: inProgress ? "600px" : "930px" }}>
          {inProgress && <AppProgress />}
          <canvas
            ref={chartRef}
            style={{
              height: "930px !important",
              position: "absolute",
              left: 16,
              top: 0,
              bottom: 16,
            }}
          ></canvas>
        </div>
      }
    ></AppCard>
  );
};

export default ResidenceBarChart;
