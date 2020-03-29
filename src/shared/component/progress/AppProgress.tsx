import React from "react";
import { progressStyles } from "./app-progress.style";
import { CircularProgress } from "@material-ui/core";

const AppProgress: React.FC = () => {
  const classes = progressStyles();

  return (
    <div className={classes.container}>
      <CircularProgress />
    </div>
  );
};

export default AppProgress;
