import { makeStyles, createStyles } from "@material-ui/core";

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
    flagCountry: {
      display: "flex",
      flexDirection: "row",
      flexGrow: 1,
    },
    flag: {
      height: "20px",
      width: "30px",
      marginRight: "10px",
      background: "lightgrey"
    },
    country: {
      fontSize: "1em",
    },
    metric: {
      width: "90px",
      fontSize: "1em",
      textAlign: "center",
      color: "#fff",
      padding: "0 10px",
      borderRadius: "5px",
      fontWeight: 500,
    },
    cases: {
      margin: "0 10px",
      background: "#ff5500",
    },
    recovered: {
      margin: "0 10px 0 0",
      background: "#38a800",
    },
    deaths: {
      margin: 0,
      background: "#464646",
    },
    odd: {
      background: "#e9e9e9",
      borderRadius: "5px",
    },
  })
);
