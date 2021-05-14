import React from "react";
import clsx from "clsx";
import { Paper, CircularProgress } from "@material-ui/core";
import { bannerStyles } from "./app-banner.style";

interface Props {
  label: string;
  value: number | string | undefined;
  increase?: number | undefined;
  selectable: boolean;
  style: { background: string; minHeight?: number };
  selected: string;
  inProgress: boolean;
  // eslint-disable-next-line no-unused-vars
  onClick: (selected: string) => void;
}

const AppBanner: React.FC<Props> = (props: Props) => {
  const classes = bannerStyles();

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
