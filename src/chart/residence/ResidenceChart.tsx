import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from "react";
import { ResizeObserver } from "@juggle/resize-observer";
import * as echarts from "echarts";
import { mainService, getMapName } from "../../shared/service/main.service";
import AppProgress from "../../shared/component/progress/AppProgress";

interface Props {
  ref: any;
  containerId: string;
}

// eslint-disable-next-line react/display-name
const ResidenceChart: React.FC<Props> = forwardRef((props: Props, ref) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [eChart, setEChart] = useState<echarts.ECharts>();
  const [data, setData] = useState<any[]>([]);
  const [forVerification, setForVerification] = useState();

  useImperativeHandle(ref, () => ({
    reset() {
      eChart?.resize();
    }
  }));

  const option: any = {
    tooltip: {
      trigger: "item",
      formatter: (params: any) =>
        `${params.data.name}: ${params.data.value.toLocaleString()}`
    },
    series: [
      {
        name: "Confirmed Cases by Residence",
        type: "treemap",
        height: "100%",
        width: "100%",
        breadcrumb: {
          show: false
        }
      }
    ]
  };

  useEffect(() => {
    // mainService.getConfirmedCasesByResidence().then((response: any) => {
      /* Old API not working */
      // const residenceData: any[] = [];
      // response.data.features.forEach((d: any) => {
      //   if (
      //     ["CHINA", "For Verification", "For validation", "None"].includes(
      //       d.attributes.residence
      //     )
      //   ) {
      //     if (
      //       ["For Verification", "For validation"].includes(
      //         d.attributes.residence
      //       )
      //     ) {
      //       setForVerification(d.attributes.value);
      //     }
      //   } else {
      //     const residenceName = getMapName(
      //       d.attributes.residence.trim().replace("�", "ñ")
      //     );
      //     residenceData.push({
      //       name: residenceName,
      //       value: d.attributes.value,
      //       label: {
      //         formatter: "{b}\n{@value}"
      //       }
      //     });
      //   }
      // });
      // setData(residenceData);
    // });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const div: HTMLDivElement = chartRef.current as HTMLDivElement;
      const chart = echarts.init(div);
      setEChart(chart);
      option.series[0].data = data;
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
        <>
          <div
            style={{
              height: "20px",
              textAlign: "right",
              fontStyle: "italic",
              fontSize: ".85em"
            }}
          >{`${forVerification} cases for residence verification`}</div>
          <div
            ref={chartRef}
            style={{
              minHeight: "100px",
              height: "calc(100% - 20px)",
              width: "100%"
            }}
          ></div>
        </>
      {/* )} */}
    </>
  );
});

export default ResidenceChart;
