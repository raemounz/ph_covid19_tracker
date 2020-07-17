import React from "react";
import clsx from "clsx";
import { Paper, CircularProgress, Tooltip } from "@material-ui/core";
import { bannerStyles } from "./app-banner.style";

interface Props {
  label: string;
  desc?: string;
  value: number | string | undefined;
  increase?: number | undefined;
  regionCity?: string | undefined;
  selectable: boolean;
  style: { background: string };
  selected: string;
  onClick: (selected: string) => void;
}

const AppBanner: React.FC<Props> = (props: Props) => {
  const classes = bannerStyles();
  const increase = Number(props.increase);

  return (
    <Paper
      elevation={3}
      className={classes.container}
      style={{
        ...props.style,
        color: "#fff",
        borderRadius: 0,
        boxShadow: "unset",
      }}
    >
      <div
        className={clsx(classes.banner, {
          [classes.selectable]: props.selectable,
        })}
        style={{
          borderRight:
            props.label === props.selected
              ? "#f6b44e 12px solid"
              : `${props.style.background} 12px solid`,
        }}
        onClick={() => props.onClick(props.label)}
      >
        <div
          className={clsx(classes.value, {
            [classes.valueNoData]: props.value === "No data",
          })}
        >
          {props.value?.toLocaleString() || <CircularProgress size={30} />}
        </div>
        <Tooltip title={props.desc || ""} placement="top">
          <div>{props.label}</div>
        </Tooltip>
        <div
          className={clsx(classes.increase, {
            [classes.regionCity]: props.regionCity,
          })}
        >
          {!props.value && props.value !== 0 ? "---" : ""}
          {!props.increase || !props.regionCity
            ? increase > 0
              ? `+ ${increase.toLocaleString()}`
              : increase < 0
              ? `- ${Math.abs(increase).toLocaleString()}`
              : props.value && !props.regionCity
              // ? "No increase"
              ? "---"
              : ""
            : ""}
          {!props.regionCity || props.regionCity}
        </div>
      </div>
    </Paper>
  );
};

export default AppBanner;
