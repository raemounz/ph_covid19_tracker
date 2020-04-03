import React from "react";
import clsx from "clsx";
import { Paper, CircularProgress, Tooltip } from "@material-ui/core";
import { bannerStyles } from "./app-banner.style";

interface Props {
  label: string;
  desc?: string;
  value: number | string | undefined;
  style: { color: string; background: string };
}

const AppBanner: React.FC<Props> = (props: Props) => {
  const classes = bannerStyles();

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
            [classes.valueNoData]: props.value === "No data"
          })}
        >
          {props.value?.toLocaleString() || (
            <CircularProgress color="secondary" size={30} />
          )}
        </div>
      </div>
    </Paper>
  );
};

export default AppBanner;
