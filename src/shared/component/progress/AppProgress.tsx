import React from "react";
import { CircularProgress } from "@mui/material";

import { progressStyles } from "./app-progress.style";

const AppProgress: React.FC = () => {
  const classes = progressStyles();

  return (
    <div className={classes.container}>
      <CircularProgress />
    </div>
  );
};

export default AppProgress;
