import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js";
import AppProgress from "../../shared/component/progress/AppProgress";

const ResidenceBarChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  let chart: Chart;
  const [isLoading, setIsLoading] = useState(true);

  const option = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ stacked: true }],
    },
  };

  useEffect(() => {
    // const canvas: HTMLCanvasElement = chartRef.current as HTMLCanvasElement;
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // chart = new Chart(canvas, {
    //   type: "bar",
    //   data: {
    //     labels: labels,
    //     datasets: [
    //       {
    //         label: "Male",
    //         backgroundColor: "#8ECEFD",
    //         data: maleDataset
    //       },
    //       {
    //         label: "Female",
    //         backgroundColor: "#F88B9D",
    //         data: femaleDataset
    //       }
    //     ]
    //   },
    //   options: option
    // });
    // chart.update();
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

export default ResidenceBarChart;
