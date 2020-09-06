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
      background: "lightgrey",
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
    active: {
      margin: "0 10px",
      background: "#f6b44e",
    },
    cases: {
      margin: "0 10px 0 0",
      background: "#df734f",
    },
    recovered: {
      margin: "0 10px 0 0",
      background: "#bfa37e",
    },
    deaths: {
      margin: 0,
      background: "#4b4743",
    },
    listItem: {
      border: "1px solid #fff",
      "&:hover": {
        border: "1px solid #bfa37e",
      },
    },
    odd: {
      background: "#f0e9e3",
      borderRadius: "5px",
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
      width: "40px",
      height: "14px",
      marginRight: "5px",
    },
  })
);
