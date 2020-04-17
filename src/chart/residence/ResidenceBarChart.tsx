import React, { useEffect, useRef } from "react";
import Chart from "chart.js";
import AppProgress from "../../shared/component/progress/AppProgress";

interface Props {
  data: any;
}

const ResidenceBarChart: React.FC<Props> = (props: Props) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  let chart: Chart;

  const option = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          stacked: true,
          position: "top",
          ticks: {
            fontSize: 13,
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
          ticks: {
            autoSkip: false,
            fontSize: 13,
          },
        },
      ],
    },
  };

  useEffect(() => {
    if (props.data) {
      const residenceMap = {};
      props.data.forEach((d: any) => {
        if (!residenceMap[d.ProvCityRes]) {
          residenceMap[d.ProvCityRes] = {
            admitted: 0,
            recovered: 0,
            death: 0,
            notAdmitted: 0,
          };
        }
        if (d.RemovalType === "Died") {
          residenceMap[d.ProvCityRes].death =
            residenceMap[d.ProvCityRes].death + 1;
        } else if (d.RemovalType === "Recovered") {
          residenceMap[d.ProvCityRes].recovered =
            residenceMap[d.ProvCityRes].recovered + 1;
        } else if (d.Admitted === "Yes") {
          residenceMap[d.ProvCityRes].admitted =
            residenceMap[d.ProvCityRes].admitted + 1;
        } else {
          residenceMap[d.ProvCityRes].notAdmitted =
            residenceMap[d.ProvCityRes].notAdmitted + 1;
        }
      });

      const labels = Object.keys(residenceMap)
        .filter((provCity: string) => provCity)
        .sort((provCity1: string, provCity2: string) => {
          const residence1: any = Object.values(residenceMap[provCity1]).reduce(
            (a: any, b: any) => a + b,
            0
          );
          const residence2: any = Object.values(residenceMap[provCity2]).reduce(
            (a: any, b: any) => a + b,
            0
          );
          return residence2 - residence1;
        });

      const datasets = [
        {
          label: "Admitted",
          backgroundColor: "#ff5500",
          data: labels.map((label: string) => residenceMap[label].admitted),
        },
        {
          label: "Recovered",
          backgroundColor: "#38a800",
          data: labels.map((label: string) => residenceMap[label].recovered),
        },
        {
          label: "Deaths",
          backgroundColor: "#464646",
          data: labels.map((label: string) => residenceMap[label].death),
        },
        {
          label: "Not Admitted",
          backgroundColor: "rgba(255, 190, 157, .6)",
          data: labels.map((label: string) => residenceMap[label].notAdmitted),
        },
      ];

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
    }
  }, [props.data]);

  return (
    <div style={{ height: "10200px" }}>
      {!props.data && <AppProgress />}
      <canvas
        ref={chartRef}
        style={{
          height: "10200px !important",
          position: "absolute",
          left: 0,
          top: 0,
        }}
      ></canvas>
    </div>
  );
};

export default ResidenceBarChart;
