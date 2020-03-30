import React from "react";
import moment from "moment";
import { headerStyles } from "./header.style";
import { IconButton } from "@material-ui/core";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const Header: React.FC = () => {
  const classes = headerStyles();

  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <div>PH COVID-19 Tracker&nbsp;</div>
        <div className={classes.date}>(as of {moment().format("ll")})</div>
      </div>
      <span style={{ flexGrow: 1 }}></span>
      <IconButton style={{ color: "#fff" }}>
        <InfoOutlinedIcon />
      </IconButton>
    </div>
  );
};

export default Header;
