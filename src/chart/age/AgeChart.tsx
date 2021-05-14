/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js";
import AppProgress from "../../shared/component/progress/AppProgress";
import { CaseType, mainService } from "../../shared/service/main.service";
import { Constants } from "../../shared/Constants";

interface Props {
  caseType: string;
}

const AgeChart: React.FC<Props> = (props: Props) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chart, setChart] = useState<Chart>();
  const [labels, setLabels] = useState<any>([]);
  const [data, setData] = useState<any>(undefined);

  const caseColor = {
    [CaseType.Active]: { MALE: "#f6b44e", FEMALE: "rgba(246, 180, 78, .6)" },
    [CaseType.Confirmed]: { MALE: "#df734f", FEMALE: "rgba(223, 115, 79, .6)" },
    [CaseType.Recovered]: {
      MALE: "#bfa37e",
      FEMALE: "rgba(191, 163, 126, .6)",
    },
    [CaseType.Deaths]: { MALE: "#4b4743", FEMALE: "rgba(75, 71, 67, .6)" },
  };

  const option = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [
        {
          stacked: true,
          scaleLabel: {
            labelString: "Age Group",
            display: true,
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
          return `Total: ${tooltipItem.reduce(
            (a: any, b: any) => a + Number(b.value),
            0
          )}`;
        },
      },
    },
  };

  const getAge = (ageGroup: string) => {
    if (ageGroup === "80+") {
      return 80;
    }
    return Number(ageGroup.split(" ")[0]);
  };

  useEffect(() => {
    mainService.getAgeGroup().then((response: any) => {
      const _labels = Object.keys(response.data)
        .filter((group: string) => group !== Constants.forValidation)
        .sort((a: string, b: string) => getAge(a) - getAge(b));
      setLabels(_labels);

      const canvas: HTMLCanvasElement = chartRef.current as HTMLCanvasElement;
      const _chart = new Chart(canvas, {
        type: "horizontalBar",
        data: {
          labels: _labels,
          datasets: [],
        },
        options: option,
      });
      setChart(_chart);
      const _data = response.data;
      delete _data[Constants.forValidation];
      setData(_data);
    });
  }, []);

  useEffect(() => {
    if (data && chart) {
      const dataset = [
        {
          label: "Male",
          backgroundColor: caseColor[props.caseType].MALE,
          data: labels.map(
            (label: string) => data[label][props.caseType.toUpperCase()].MALE
          ),
        },
        {
          label: "Female",
          backgroundColor: caseColor[props.caseType].FEMALE,
          data: labels.map(
            (label: string) => data[label][props.caseType.toUpperCase()].FEMALE
          ),
        },
      ];
      chart.data.datasets = dataset;
      chart.update();
    }
  }, [data, props.caseType]);

  return (
    <>
      {!data && <AppProgress />}
      <div
        style={{
          display: !data ? "none" : "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: "520px" }}>
          <canvas
            ref={chartRef}
            style={{ height: "100% !important", flexGrow: 1 }}
          ></canvas>
        </div>
      </div>
    </>
  );
};

export default AgeChart;
