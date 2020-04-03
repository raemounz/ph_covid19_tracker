import { makeStyles, createStyles } from "@material-ui/core";

export const bannerStyles = makeStyles(() =>
  createStyles({
    container: {
      display: "flex",
      height: "100%"
    },
    banner: {
      padding: "16px",
      width: "100%",
      fontSize: "1.6em",
      fontWeight: 500,
      textAlign: "center"
    },
    value: {
      fontSize: "1.8em"
    },
    valueNoData: {
      fontSize: ".9em",
      height: "calc(100% - 32px)",
      lineHeight: "50px",
      fontWeight: "normal"
    }
  })
);
