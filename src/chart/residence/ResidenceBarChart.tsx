import React, { useEffect, useRef, useState } from "react";
import Chart, { ChartOptions } from "chart.js/auto";

import AppProgress from "../../shared/component/progress/AppProgress";
import AppCard from "../../shared/component/card/AppCard";
import { CaseType, mainService } from "../../shared/service/main.service";
import { Constants } from "../../shared/Constants";

const ResidenceBarChart: React.FC = () => {
  const [inProgress, setInProgress] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  let chart: Chart;

  const option: ChartOptions = {
    maintainAspectRatio: false,
    indexAxis: "y",
    interaction: {
      intersect: true,
      mode: "index",
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 13,
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          footer: (tooltipItems: any) => {
            return `Total: ${tooltipItems
              .filter((item: any) => item.datasetIndex > 0)
              .reduce((a: any, b: any) => a + Number(b.parsed.x), 0)
              .toLocaleString()}`;
          },
        },
      },
    },
  };

  const data = {
    ACTIVE: {
      data: [],
      backgroundColor: Constants.activeColor,
      label: CaseType.Active,
      stack: "active",
    },
    ADMITTED: {
      data: [],
      backgroundColor: Constants.confirmedColor,
      label: "Admitted",
      stack: "cases",
    },
    RECOVERED: {
      data: [],
      backgroundColor: Constants.recoveredColor,
      label: CaseType.Recovered,
      stack: "cases",
    },
    DEATHS: {
      data: [],
      backgroundColor: Constants.deathColor,
      label: CaseType.Deaths,
      stack: "cases",
    },
    "NOT ADMITTED": {
      data: [],
      backgroundColor: Constants.dailyConfirmedColor,
      label: "Not Admitted",
      stack: "cases",
    },
  };

  useEffect(() => {
    setInProgress(true);
    mainService.getTop30Cities().then((response: any) => {
      const labels: string[] = [];
      // Exclude 'For Validation' records
      response.data
        .filter((d: any) => d.city !== Constants.forValidation)
        .forEach((d: any) => {
          labels.push(d.city);
          d.cases
            .filter((c: any) => c.case !== "TOTAL")
            .forEach((c: any) => data[c.case].data.push(c.count));
        });
      const datasets = Object.keys(data).map((c: any) => data[c]);

      const canvas: HTMLCanvasElement = chartRef.current as HTMLCanvasElement;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      chart = new Chart(canvas, {
        type: "bar",
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
        height: 600,
        content: {
          position: "relative",
          height: "calc(100% - 76px)",
          padding: "0 16px",
          overflow: "auto",
        },
      }}
      content={
        <div style={{ height: inProgress ? 600 : 930 }}>
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
