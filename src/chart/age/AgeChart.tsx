import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js";
import { mainService } from "../../shared/service/main.service";
import AppProgress from "../../shared/component/progress/AppProgress";

const AgeChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  let chart: Chart;
  const [isLoading, setIsLoading] = useState(true);

  const option = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ stacked: true }]
    }
  };

  useEffect(() => {
    const labelSet = new Set();
    let labels;
    const maleData = {};
    let maleDataset;
    const femaleData = {};
    let femaleDataset;
    mainService.getConfirmedCasesByAgeGroup().then((response: any) => {
      /* Old API not working */
      // response.data.features.forEach((f: any) => {
      //   if (f.attributes.sex.toLowerCase() === "male") {
      //     maleData[f.attributes.age_categ] = f.attributes.value;
      //   } else {
      //     femaleData[f.attributes.age_categ] = f.attributes.value;
      //   }
      //   labelSet.add(f.attributes.age_categ);
      // });
      // labels = Array.from(labelSet).sort();
      // maleDataset = labels.map((label: string) => maleData[label]);
      // femaleDataset = labels.map((label: string) => femaleData[label]);

      setIsLoading(false);
      const canvas: HTMLCanvasElement = chartRef.current as HTMLCanvasElement;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      chart = new Chart(canvas, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Male",
              backgroundColor: "#8ECEFD",
              data: maleDataset
            },
            {
              label: "Female",
              backgroundColor: "#F88B9D",
              data: femaleDataset
            }
          ]
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

export default AgeChart;
