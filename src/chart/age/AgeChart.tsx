import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js";
import AppProgress from "../../shared/component/progress/AppProgress";
import { FormControl, Select, MenuItem } from "@material-ui/core";

interface Props {
  data: any;
}

const AgeChart: React.FC<Props> = (props: Props) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chart, setChart] = useState<Chart>();
  const [caseType, setCaseType] = useState("confirmed");
  const [dataMap, setDataMap] = useState({});
  const [labels, setLabels] = useState<string[]>([]);

  const caseColor = {
    confirmed: {male: "#ff5500", female: "rgba(255, 190, 157, .6)"},
    recovered: {male: "#38a800", female: "rgba(56, 168, 0, .6)"},
    death: {male: "#464646", female: "rgba(70, 70, 70, .6)"}
  }

  const option = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ stacked: true, scaleLabel: {
        labelString: "Age Group",
        display: true,
      }, }],
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
    if (props.data) {
      const ageMap = {};
      props.data.forEach((d: any) => {
        if (!ageMap[d.AgeGroup]) {
          ageMap[d.AgeGroup] = {
            confirmed: {
              male: 0,
              female: 0,  
            },
            recovered: {
              male: 0,
              female: 0,  
            },
            death: {
              male: 0,
              female: 0,  
            }
          };
        }
        if (d.Sex === "Male") {
          ageMap[d.AgeGroup].confirmed.male = ageMap[d.AgeGroup].confirmed.male + 1;
          if (d.RemovalType === "Died") {
            ageMap[d.AgeGroup].death.male = ageMap[d.AgeGroup].death.male + 1;
          } else if (d.RemovalType === "Recovered") {
            ageMap[d.AgeGroup].recovered.male = ageMap[d.AgeGroup].recovered.male + 1;
          }
        } else {
          ageMap[d.AgeGroup].confirmed.female = ageMap[d.AgeGroup].confirmed.female + 1;
          if (d.RemovalType === "Died") {
            ageMap[d.AgeGroup].death.female = ageMap[d.AgeGroup].death.female + 1;
          } else if (d.RemovalType === "Recovered") {
            ageMap[d.AgeGroup].recovered.female = ageMap[d.AgeGroup].recovered.female + 1;
          }
        }
      });
      setDataMap(ageMap);

      const _labels = Object.keys(ageMap)
        .filter((group: string) => group)
        .sort((group1: string, group2: string) => {
          const grp1 = getAge(group1);
          const grp2 = getAge(group2);
          return grp1 - grp2;
        });
      setLabels(_labels);

      const canvas: HTMLCanvasElement = chartRef.current as HTMLCanvasElement;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const _chart = new Chart(canvas, {
        type: "horizontalBar",
        data: {
          labels: _labels,
          datasets: [],
        },
        options: option,
      });
      setChart(_chart);
      populateDataset(_chart, ageMap, _labels, caseType);
    }
  }, [props.data]);

  const populateDataset = (_chart: Chart | undefined, data: any, _labels: string[], _caseType: string) => {
    let dataset = [
      {
        label: "Male",
        backgroundColor: caseColor[_caseType].male,
        data: _labels.map((label: string) => data[label][_caseType].male),
      },
      {
        label: "Female",
        backgroundColor: caseColor[_caseType].female,
        data: _labels.map((label: string) => data[label][_caseType].female),
      },
    ];
    if (_chart) {
      _chart.data.datasets = dataset;
      _chart.update();
    } else if (chart) {
      chart.data.datasets = dataset;
      chart.update();
    }
  }

  const onChangeCaseType = (event) => {
    setCaseType(event.target.value);
    populateDataset(undefined, dataMap, labels, event.target.value);
  }

  return (
    <>
      {!props.data && <AppProgress />}
      <div
        style={{
          display: !props.data ? "none" : "flex",
          flexDirection: "column",
        }}
      >
        <FormControl
          variant="outlined"
          style={{ minWidth: "150px", marginBottom: "15px" }}
        >
          <Select value={caseType} onChange={onChangeCaseType}>
            <MenuItem value="confirmed" style={{ fontSize: ".9em" }}>Confirmed</MenuItem>
            <MenuItem value="recovered" style={{ fontSize: ".9em" }}>Recovered</MenuItem>
            <MenuItem value="death" style={{ fontSize: ".9em" }}>Death</MenuItem>
          </Select>
        </FormControl>
        <div style={{ height: "500px" }}>
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
