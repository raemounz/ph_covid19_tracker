import React, { useRef, useState, useEffect } from "react";
import { ResizeObserver } from "@juggle/resize-observer";
import * as echarts from "echarts";
import { mainService, getMapName } from "../../shared/service/main.service";
import AppProgress from "../../shared/component/progress/AppProgress";
import PHMap from "./philippine.json";

interface Props {
  containerId: string;
}

const DistributionMap: React.FC<Props> = (props: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [eChart, setEChart] = useState<echarts.ECharts>();
  const [data, setData] = useState<any[]>([]);
  const [values, setValues] = useState([]);

  const option: any = {
    tooltip: {
      trigger: "item",
      formatter: (params: any) =>
        params.data
          ? `${params.data.name}: ${params.data.value.toLocaleString()}`
          : `${params.name}: 0`
    },
    visualMap: {
      top: 0,
      realtime: false,
      calculable: true,
      inRange: {
        color: ["#ffd9cd", "#b23c17"]
      },
      padding: 16
    },
    series: [
      {
        zoom: 1.1,
        name: "Confirmed Cases",
        type: "map",
        mapType: "PH",
        roam: true,
        label: {
          show: false
        }
      }
    ]
  };

  useEffect(() => {
    const PHData = {};

    // Residence name from json
    const PHset = new Set();
    PHMap["features"].forEach((f: any) => PHset.add(f.properties.name));

    const set = new Set();
    const noSet = new Set();
    mainService.getConfirmedCasesByResidence().then((response: any) => {
      /* Old API not working */
      // const valuesArr: any = [];
      // response.data.features.forEach((d: any) => {
      //   const residenceName = getMapName(
      //     d.attributes.residence.trim().replace("�", "ñ")
      //   );
      //   set.add(residenceName);
      //   PHData[residenceName] = d.attributes.value;
      //   if (
      //     !["For Verification", "For validation", "None"].includes(
      //       d.attributes.residence
      //     )
      //   ) {
      //     valuesArr.push(d.attributes.value);
      //   }
      // });
      // setValues(valuesArr);
      // setData(
      //   Object.keys(PHData).map((d: string) => {
      //     return {
      //       name: d,
      //       value: PHData[d]
      //     };
      //   })
      // );
      // set.forEach((residence: any) => {
      //   if (!PHset.has(residence)) {
      //     noSet.add(residence);
      //   }
      // });
      // const tempObj = {};
      // let index = 0;
      // noSet.forEach(s => (tempObj[index++] = s));
      // console.log("new residences", noSet);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const div: HTMLDivElement = chartRef.current as HTMLDivElement;
      const chart = echarts.init(div);
      setEChart(chart);
      option.series[0].data = data;
      option.visualMap.min = Math.min(...values);
      option.visualMap.max = Math.max(...values);
      echarts.registerMap("PH", PHMap);
      chart.setOption(option);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (eChart) {
      // Workaround since echarts do not respond well on container resize
      const resizeObserver = new ResizeObserver(() => eChart.resize());
      const container: HTMLElement = document.getElementById(
        props.containerId
      ) as HTMLElement;
      if (container) {
        resizeObserver.observe(container);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eChart]);

  return (
    <>
      {/* {data.length === 0 ? (
        <AppProgress />
      ) : ( */}
        <div
          ref={chartRef}
          style={{
            minHeight: "100px",
            height: "100%",
            width: "100%",
            background: "#bad6db"
          }}
        ></div>
      {/* )} */}
    </>
  );
};

export default DistributionMap;
