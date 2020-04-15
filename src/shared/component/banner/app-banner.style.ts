import { makeStyles, createStyles } from "@material-ui/core";

export const bannerStyles = makeStyles(() =>
  createStyles({
    container: {
      display: "flex",
      height: "100%",
    },
    banner: {
      padding: "16px",
      width: "100%",
      fontSize: "1.6em",
      fontWeight: 500,
      textAlign: "center",
    },
    label: {
      fontWeight: 500
    },
    value: {
      fontSize: "1.9em",
      fontWeight: "bold"
    },
    valueNoData: {
      fontSize: ".9em",
      height: "calc(100% - 32px)",
      lineHeight: "50px",
      fontWeight: "normal",
    },
    increase: {
      fontSize: ".9em",
      height: "40px",
      lineHeight: "40px",
      minWidth: "100px",
      maxWidth: "250px",
      borderRadius: "6px",
      margin: "10px auto auto auto",
      background: "#fff",
      fontWeight: "bold",
    },
  })
);
