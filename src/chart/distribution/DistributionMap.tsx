import React, { useRef, useState, useEffect } from "react";
import { ResizeObserver } from "@juggle/resize-observer";
import * as echarts from "echarts";
import { mainService } from "../../shared/service/main.service";
import AppProgress from "../../shared/component/progress/AppProgress";
import PHMap from "./philippine.json";

interface Props {
  containerId: string;
}

const DistributionMap: React.FC<Props> = (props: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [eChart, setEChart] = useState<echarts.ECharts>();
  const [data, setData] = useState<any[]>([]);

  const option: any = {
    tooltip: {
      trigger: "item"
      // formatter: (params: any) =>
      //   `${params.data.name}: ${params.data.value.toLocaleString()}`
    },
    visualMap: {
      top: 0,
      realtime: false,
      calculable: true,
      inRange: {
        color: ["#fff", "#cc451b"]
      },
      padding: 16
    },
    series: [
      {
        zoom: 1.2,
        name: "Philippine Geomap",
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
    mainService.getConfirmedCasesByResidence().then((response: any) => {
      // TODO
      setData([{ name: "test", value: 1 }]);
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const div: HTMLDivElement = chartRef.current as HTMLDivElement;
      const chart = echarts.init(div);
      setEChart(chart);
      // option.series[0].data = data;
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
      {data.length === 0 ? (
        <AppProgress />
      ) : (
        <div
          ref={chartRef}
          style={{ minHeight: "100px", height: "100%", width: "100%" }}
        ></div>
      )}
    </>
  );
};

export default DistributionMap;
