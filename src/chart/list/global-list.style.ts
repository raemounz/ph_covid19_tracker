import { createStyles, makeStyles } from "@mui/styles";

import { Constants } from "../../shared/Constants";

export const globalListStyles = makeStyles(() =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
    },
    containerCol: {
      flexDirection: "column",
    },
    selection: {
      minWidth: 120,
      top: -3,
      marginRight: 8,
    },
    flagCountry: {
      display: "flex",
      flexDirection: "row",
      flexGrow: 1,
    },
    flag: {
      height: 20,
      width: 30,
      marginRight: 10,
      background: "lightgrey",
    },
    country: {
      fontSize: "1em",
    },
    metric: {
      width: 106,
      fontSize: "1em",
      textAlign: "center",
      color: "#fff",
      padding: "0 10px",
      borderRadius: 5,
      fontWeight: 500,
    },
    active: {
      margin: "0 10px",
      background: Constants.activeColor,
      color: Constants.grayFontColor,
    },
    cases: {
      margin: "0 10px 0 0",
      background: Constants.confirmedColor,
    },
    recovered: {
      margin: "0 10px 0 0",
      background: Constants.recoveredColor,
      color: Constants.grayFontColor,
    },
    deaths: {
      margin: 0,
      background: Constants.deathColor,
    },
    listItem: {
      border: "1px solid #fff",
      "&:hover": {
        border: `1px solid ${Constants.grayFontColor}`,
      },
      borderRadius: 5,
    },
    odd: {
      border: `1px solid ${Constants.activeColor}`,
      borderRadius: 5,
    },
    legend: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      margin: "6px auto",
    },
    legendItem: {
      display: "flex",
      flexDirection: "row",
      margin: "2px 5px",
    },
    legendLabel: {
      fontSize: ".83em",
      lineHeight: "14px",
      color: "#4c4c52",
    },
    legendBox: {
      width: 40,
      height: 14,
      marginRight: 5,
    },
  })
);
