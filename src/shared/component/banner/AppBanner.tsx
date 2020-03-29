import React from "react";
import { Paper, CircularProgress, Tooltip } from "@material-ui/core";
import { bannerStyles } from "./app-banner.style";

interface Props {
  label: string;
  desc?: string;
  value: number | undefined;
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
        <div className={classes.value}>
          {props.value?.toLocaleString() || <CircularProgress size={30} />}
        </div>
      </div>
    </Paper>
  );
};

export default AppBanner;
