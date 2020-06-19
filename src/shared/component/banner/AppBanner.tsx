import React, { useState } from "react";
import clsx from "clsx";
import { Paper, CircularProgress, Tooltip } from "@material-ui/core";
import { bannerStyles } from "./app-banner.style";

interface Props {
  label: string;
  desc?: string;
  value: number | string | undefined;
  increase: number | undefined;
  selectable: boolean;
  style: { background: string };
}

const AppBanner: React.FC<Props> = (props: Props) => {
  const classes = bannerStyles();
  const increase = Number(props.increase);
  const [selected, setSelected] = useState("Confirmed-TODO");

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
          borderRight: props.label === selected
            ? "#f6b44e 10px solid"
            : `${props.style.background} 10px solid`,
        }}
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
        <div className={classes.increase}>
          {increase > 0
            ? `+ ${increase.toLocaleString()}`
            : increase < 0
            ? `- ${Math.abs(increase).toLocaleString()}`
            : props.value
            ? "No increase"
            : "---"}
        </div>
      </div>
    </Paper>
  );
};

export default AppBanner;
