import { makeStyles, createStyles } from "@material-ui/core";

export const globalListStyles = makeStyles(() =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
    },
    flag: {
      height: "27px",
      width: "40px",
      marginRight: "10px",
    },
    country: {
      flexGrow: 1,
      fontSize: "1.3em",
      maxWidth: "calc(100% - 325px)",
    },
    cases: {
      width: "75px",
      margin: "0 10px",
      fontSize: "1.3em",
      textAlign: "right",
      color: "#ff5500",
      fontWeight: 500,
    },
    recovered: {
      width: "70px",
      margin: "0 10px",
      fontSize: "1.3em",
      textAlign: "right",
      color: "#38a800",
      fontWeight: 500,
    },
    deaths: {
      width: "70px",
      margin: "0 10px",
      fontSize: "1.3em",
      textAlign: "right",
      color: "#464646",
      fontWeight: 500,
    },
  })
);
