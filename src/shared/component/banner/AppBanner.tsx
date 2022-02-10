import React from "react";
import { CircularProgress, Paper } from "@mui/material";
import clsx from "clsx";

import { bannerStyles } from "./app-banner.style";

interface Props {
  label: string;
  value: number | string | undefined;
  increase?: number | undefined;
  style?: any;
  inProgress: boolean;
}

const AppBanner: React.FC<Props> = (props: Props) => {
  const classes = bannerStyles();

  return (
    <Paper
      elevation={0}
      className={classes.container}
      style={{
        ...props.style,
        color: props.style.color || "#fff",
        borderRadius: 0,
        boxShadow: "unset",
      }}
    >
      <div className={classes.banner}>
        <div
          className={clsx(
            classes.value,
            {
              [classes.valueNoData]: props.value === "No data",
            },
            { [classes.inProgressValue]: props.inProgress }
          )}
        >
          {props.inProgress && (
            <CircularProgress size={30} style={{ position: "absolute" }} />
          )}
          {props.value?.toLocaleString()}
        </div>
        <div>{props.label}</div>
        {props.increase && (
          <div
            className={clsx(classes.increase, {
              [classes.inProgressValue]: props.inProgress,
            })}
          >
            {props.increase.toLocaleString()} new cases
          </div>
        )}
      </div>
    </Paper>
  );
};

export default AppBanner;
