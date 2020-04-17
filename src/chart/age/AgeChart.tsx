import React, { useRef, useEffect } from "react";
import Chart, { InteractionMode } from "chart.js";
import AppProgress from "../../shared/component/progress/AppProgress";

interface Props {
  data: any;
}

const AgeChart: React.FC<Props> = (props: Props) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  let chart: Chart;
  const tooltipMode: InteractionMode = "x";

  const option = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ stacked: true }],
    },
    tooltips: {
      mode: tooltipMode,
      intersect: false,
    },
  };

  useEffect(() => {
    if (props.data) {
      const ageMap = {};
      props.data.forEach((d: any) => {
        if (!ageMap[d.AgeGroup]) {
          ageMap[d.AgeGroup] = {
            male: 0,
            female: 0,
          };
        }
        if (d.Sex === "Male") {
          ageMap[d.AgeGroup].male = ageMap[d.AgeGroup].male + 1;
        } else {
          ageMap[d.AgeGroup].female = ageMap[d.AgeGroup].female + 1;
        }
      });

      const labels = Object.keys(ageMap)
        .filter((group: string) => group)
        .sort((group1: string, group2: string) => {
          const grp1 = Number(group1.split(" ")[0]);
          const grp2 = Number(group2.split(" ")[0]);
          return grp1 - grp2;
        });

      const canvas: HTMLCanvasElement = chartRef.current as HTMLCanvasElement;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      chart = new Chart(canvas, {
        type: "horizontalBar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Male",
              backgroundColor: "#ff5500",
              data: labels.map((label: string) => ageMap[label].male),
            },
            {
              label: "Female",
              backgroundColor: "rgba(255, 190, 157, .6)",
              data: labels.map((label: string) => ageMap[label].female),
            },
          ],
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

export default AgeChart;
