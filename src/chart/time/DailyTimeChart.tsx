import React, { useRef, useEffect, useState } from "react";
import Chart, { InteractionMode } from "chart.js";
import moment from "moment";
import AppProgress from "../../shared/component/progress/AppProgress";
import { PHCase } from "../../shared/service/main.service";
import {
  FormControl,
  Select,
  MenuItem,
  ListSubheader,
} from "@material-ui/core";

interface Props {
  data: PHCase[] | undefined;
}

const DailyTimeChart: React.FC<Props> = (props: Props) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chart, setChart] = useState<Chart>();
  const confirmed = "confirmed";
  const recovered = "recovered";
  const deaths = "deaths";
  const tooltipMode: InteractionMode = "index";
  const cutoff = Date.parse("03/01/2020");

  const allProvinces = "All Provinces";
  const allCities = "All Cities";
  const forValidation = "For Validation";
  const [regionMap, setRegionMap] = useState({});
  const [province, setProvince] = useState(allProvinces);
  const [city, setCity] = useState(allCities);

  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const option = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          id: "daily-axis",
          type: "linear",
          position: "left",
          stacked: true,
        },
        {
          id: "cumulative-axis",
          type: "linear",
          position: "right",
        },
      ],
      xAxes: [
        {
          type: "time",
          stacked: true,
          offset: true,
        },
      ],
    },
    tooltips: {
      mode: tooltipMode,
      intersect: false,
      callbacks: {
        title: (tooltipItem: any) => {
          const date = Date.parse(tooltipItem[0].label);
          return moment(date).format("ll");
        },
        label: (tooltipItem: any, data: any) => {
          let label = data.datasets[tooltipItem.datasetIndex].label || "";
          if (label) {
            label = ` ${capitalize(
              label
            )}: ${tooltipItem.yLabel.toLocaleString()}`;
          }
          return label;
        },
      },
    },
  };

  const dataset: any = [
    {
      label: capitalize(confirmed),
      fill: false,
      lineTension: 0,
      pointStyle: "circle",
      pointRadius: 0,
      borderWidth: 4,
      borderColor: "#ff5500",
      backgroundColor: "#ff5500",
      data: [],
      yAxisID: "cumulative-axis",
      type: "line",
    },
    {
      label: capitalize(recovered),
      fill: false,
      lineTension: 0,
      pointStyle: "circle",
      pointRadius: 0,
      borderWidth: 4,
      borderColor: "#38a800",
      backgroundColor: "#38a800",
      data: [],
      yAxisID: "cumulative-axis",
      type: "line",
    },
    {
      label: capitalize(deaths),
      fill: false,
      lineTension: 0,
      pointStyle: "circle",
      pointRadius: 0,
      borderWidth: 4,
      borderColor: "#464646",
      backgroundColor: "#464646",
      data: [],
      yAxisID: "cumulative-axis",
      type: "line",
    },
    {
      label: "Daily Confirmed",
      backgroundColor: "rgba(255, 190, 157, .6)",
      data: [],
      yAxisID: "daily-axis",
    },
    {
      label: "Daily Recovered",
      backgroundColor: "rgba(56, 168, 0, .6)",
      data: [],
      yAxisID: "daily-axis",
    },
    {
      label: "Daily Deaths",
      backgroundColor: "rgba(70, 70, 70, .6)",
      data: [],
      yAxisID: "daily-axis",
    },
  ];

  const createMetric = () => {
    return {
      confirmed: 0,
      recovered: 0,
      death: 0,
    };
  };

  useEffect(() => {
    if (props.data) {
      // Regions and Provinces
      const regMap = {};
      props.data.forEach((d: PHCase) => {
        if (d.RegionRes) {
          if (!regMap[d.RegionRes]) {
            regMap[d.RegionRes] = new Set();
          }
          regMap[d.RegionRes].add(d.ProvCityRes || forValidation);
        }
      });
      setRegionMap(regMap);

      const canvas: HTMLCanvasElement = chartRef.current as HTMLCanvasElement;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const _chart = new Chart(canvas, {
        type: "bar",
        data: {
          datasets: dataset,
        },
        options: option,
      });
      setChart(_chart);

      populateDataset(_chart, props.data, province, city);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  const populateDataset = (
    _chart: Chart | undefined,
    data: PHCase[] | undefined,
    _province: string,
    _city: string
  ) => {
    if (data) {
      // Daily cases
      const dailyMap = {};
      const sameRemConfDate: any = [];
      let filteredData: PHCase[];

      // Clear chart data
      dataset.forEach((d: any) => (d.data = []));

      if (_province === allProvinces) {
        if (_city === allCities) {
          filteredData = data.filter(
            (d: PHCase) => d.RegionRes !== _province && d.ProvCityRes !== _city
          );
        } else {
          filteredData = data.filter(
            (d: PHCase) => d.RegionRes !== _province && d.ProvCityRes === _city
          );
        }
      } else {
        if (_city === allCities) {
          filteredData = data.filter(
            (d: PHCase) => d.RegionRes === _province && d.ProvCityRes !== _city
          );  
        } else {
          filteredData = data.filter(
            (d: PHCase) => d.RegionRes === _province && d.ProvCityRes === _city
          );  
        }
      }
      filteredData.forEach((d: PHCase) => {
        const confDate = moment(new Date(d.DateRepConf)).format("M/D/YYYY");
        const repRemDate = moment(new Date(d.DateRepRem)).format("M/D/YYYY");
        if (d.RemovalType === "Died") {
          if (!dailyMap[repRemDate]) {
            dailyMap[repRemDate] = createMetric();
          }
          dailyMap[repRemDate].death = dailyMap[repRemDate].death + 1;
        } else if (d.RemovalType === "Recovered") {
          if (!dailyMap[repRemDate]) {
            dailyMap[repRemDate] = createMetric();
          }
          dailyMap[repRemDate].recovered = dailyMap[repRemDate].recovered + 1;
        }
        if (!dailyMap[confDate]) {
          dailyMap[confDate] = createMetric();
        }
        dailyMap[confDate].confirmed = dailyMap[confDate].confirmed + 1;
      });

      let lastConfirmed = 0;
      let lastRecovered = 0;
      let lastDeath = 0;
      Object.keys(dailyMap)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .forEach((date: string) => {
          if (new Date(date).getTime() >= cutoff) {
            dataset
              .find(
                (d: any) => d.label.toLowerCase() === recovered.toLowerCase()
              )
              .data.push({
                x: new Date(date),
                y: lastRecovered + dailyMap[date].recovered,
              });
          }
          lastRecovered = lastRecovered + dailyMap[date].recovered;
          if (new Date(date).getTime() >= cutoff) {
            dataset
              .find((d: any) => d.label.toLowerCase() === deaths.toLowerCase())
              .data.push({
                x: new Date(date),
                y: lastDeath + dailyMap[date].death,
              });
          }
          lastDeath = lastDeath + dailyMap[date].death;
          let totalConfirmed = lastConfirmed + dailyMap[date].confirmed;
          if (sameRemConfDate.includes(date)) {
            totalConfirmed =
              totalConfirmed + dailyMap[date].recovered + dailyMap[date].death;
          }
          if (new Date(date).getTime() >= cutoff) {
            dataset
              .find(
                (d: any) => d.label.toLowerCase() === confirmed.toLowerCase()
              )
              .data.push({
                x: new Date(date),
                y: totalConfirmed,
              });
          }
          lastConfirmed = totalConfirmed;
          if (new Date(date).getTime() >= cutoff) {
            dataset
              .find((d: any) => d.label === "Daily Confirmed")
              .data.push({
                x: new Date(date),
                y: dailyMap[date].confirmed,
              });
            dataset
              .find((d: any) => d.label === "Daily Recovered")
              .data.push({
                x: new Date(date),
                y: dailyMap[date].recovered,
              });
            dataset
              .find((d: any) => d.label === "Daily Deaths")
              .data.push({
                x: new Date(date),
                y: dailyMap[date].death,
              });
          }
        });

      if (_chart) {
        _chart.data.datasets = dataset;
        _chart.update();
      } else if (chart) {
        chart.data.datasets = dataset;
        chart.update();
      }
    }
  };

  const onChangeProvince = (event: any) => {
    setProvince(event.target.value);
    setCity(allCities);
    populateDataset(undefined, props.data, event.target.value, allCities);
  };

  const onChangeCity = (event: any, child: any) => {
    if (event.target.value) {
      let _province = allProvinces;
      if (child.props.id) {
        _province = child.props.id.split("-")[0];
      }
      setCity(event.target.value);
      populateDataset(undefined, props.data, _province, event.target.value);
    }
  };

  return (
    <>
      {!props.data && <AppProgress />}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <FormControl
          variant="outlined"
          style={{ minWidth: "150px", marginBottom: "5px" }}
        >
          <Select value={province} onChange={onChangeProvince}>
            <MenuItem value={allProvinces} style={{ fontSize: ".9em" }}>
              {allProvinces}
            </MenuItem>
            {Object.keys(regionMap)
              .sort()
              .map((r: string) => {
                return (
                  <MenuItem key={r} value={r} style={{ fontSize: ".9em" }}>
                    {r}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          style={{ minWidth: "150px", marginBottom: "15px" }}
        >
          <Select value={city} onChange={onChangeCity}>
            <MenuItem value={allCities} style={{ fontSize: ".9em" }}>
              {allCities}
            </MenuItem>
            {province === allProvinces
              ? Object.keys(regionMap)
                  .sort()
                  .map((r: string) => {
                    const group = [<ListSubheader key={r}>{r}</ListSubheader>];
                    Array.from(regionMap[r])
                      .sort()
                      .forEach((c: any) => {
                        group.push(
                          <MenuItem
                            id={`${r}-${c}`}
                            key={`${r}-${c}`}
                            value={c}
                            style={{ fontSize: ".9em" }}
                          >
                            {c}
                          </MenuItem>
                        );
                      });
                    return group;
                  })
              : Array.from(regionMap[province])
                  .sort()
                  .map((c: any) => {
                    return (
                      <MenuItem
                        id={`${province}-${c}`}
                        key={`${province}-${c}`}
                        value={c}
                        style={{ fontSize: ".9em" }}
                      >
                        {c}
                      </MenuItem>
                    );
                  })}
          </Select>
        </FormControl>
        <div style={{ height: "480px" }}>
          <canvas
            ref={chartRef}
            style={{ height: "100% !important", flexGrow: 1 }}
          ></canvas>
        </div>
      </div>
    </>
  );
};

export default DailyTimeChart;
