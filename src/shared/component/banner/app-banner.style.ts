import { makeStyles, createStyles } from "@material-ui/core";

export const bannerStyles = makeStyles(() =>
  createStyles({
    container: {
      display: "flex",
      height: "156px",
    },
    banner: {
      padding: "16px 6px 16px 16px",
      width: "100%",
      fontSize: "1.6em",
      textAlign: "center",
      "&:hover": {
        borderRight: "#f6b44e 12px solid !important",
      },
      display: "flex",
      flexDirection: "column"
    },
    selectable: {
      cursor: "pointer",
    },
    value: {
      fontSize: "2.1em",
    },
    valueNoData: {
      fontSize: ".9em",
      height: "calc(100% - 32px)",
      lineHeight: "50px",
      fontWeight: "normal",
    },
    increase: {
      fontSize: ".7em",
    },
    regionCity: {
      fontSize: "0.54em",
    },
  })
);
