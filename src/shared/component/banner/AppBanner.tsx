import React from "react";
import clsx from "clsx";
import { Paper, CircularProgress, Tooltip } from "@material-ui/core";
import { bannerStyles } from "./app-banner.style";

interface Props {
  label: string;
  desc?: string;
  value: number | string | undefined;
  oldValue: number | undefined;
  style: { color: string; background: string };
}

const AppBanner: React.FC<Props> = (props: Props) => {
  const classes = bannerStyles();
  const newValue = Number(props.value);
  const oldValue = Number(props.oldValue);

  return (
    <Paper
      elevation={3}
      className={classes.container}
      style={{ ...props.style }}
    >
      <div className={classes.banner}>
        <Tooltip title={props.desc || ""} placement="top">
          <div>{props.label}</div>
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
          {!isNaN(oldValue)
            ? newValue - oldValue > 0
              ? `Up by ${(newValue - oldValue).toLocaleString()}`
              : "No increase"
            : ""}
        </div>
      </div>
    </Paper>
  );
};

export default AppBanner;
