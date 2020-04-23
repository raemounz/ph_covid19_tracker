import React from "react";
import clsx from "clsx";
import { Paper, CircularProgress, Tooltip } from "@material-ui/core";
import { bannerStyles } from "./app-banner.style";

interface Props {
  label: string;
  desc?: string;
  value: number | string | undefined;
  increase: number | undefined;
  style: { color: string; background: string };
}

const AppBanner: React.FC<Props> = (props: Props) => {
  const classes = bannerStyles();
  const increase = Number(props.increase);

  return (
    <Paper
      elevation={3}
      className={classes.container}
      style={{ ...props.style }}
    >
      <div className={classes.banner}>
        <Tooltip title={props.desc || ""} placement="top">
          <div className={classes.label}>{props.label}</div>
        </Tooltip>
        <div
          className={clsx(classes.value, {
            [classes.valueNoData]: props.value === "No data",
          })}
        >
          {props.value?.toLocaleString() || <CircularProgress size={30} />}
        </div>
        <div
          className={classes.increase}
          style={{ color: props.style.background }}
        >
          {increase > 0 ? `up by ${increase.toLocaleString()}` : "No increase"}
        </div>
      </div>
    </Paper>
  );
};

export default AppBanner;
