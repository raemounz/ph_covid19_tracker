/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import Chart, { ChartOptions } from "chart.js/auto";

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
  const [MALE, FEMALE] = ["Male", "Female"];

  const caseColor = {
    [CaseType.Active]: {
      [MALE]: Constants.activeColor,
      [FEMALE]: Constants.dailyActiveColor,
    },
    [CaseType.Confirmed]: {
      [MALE]: Constants.confirmedColor,
      [FEMALE]: Constants.dailyConfirmedColor,
    },
    [CaseType.Recovered]: {
      [MALE]: Constants.recoveredColor,
      [FEMALE]: Constants.dailyRecoveredColor,
    },
    [CaseType.Deaths]: {
      [MALE]: Constants.deathColor,
      [FEMALE]: Constants.dailyDeathColor,
    },
  };

  const option: ChartOptions = {
    maintainAspectRatio: false,
    indexAxis: "y",
    interaction: {
      intersect: true,
      mode: "index",
    },
    scales: {
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
              .reduce((a: any, b: any) => a + Number(b.parsed.x), 0)
              .toLocaleString()}`;
          },
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
        type: "bar",
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
          label: MALE,
          backgroundColor: caseColor[props.caseType][MALE],
          data: labels.map(
            (label: string) => data[label][props.caseType.toUpperCase()].MALE
          ),
        },
        {
          label: FEMALE,
          backgroundColor: caseColor[props.caseType][FEMALE],
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
        <div style={{ height: 520 }}>
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
