import { makeStyles, createStyles } from "@material-ui/core";

export const cardStyles = makeStyles(() =>
  createStyles({
    header: {
      height: "60px",
      display: "flex",
      flexDirection: "row",
      padding: "16px",
      lineHeight: "30px",
      fontSize: "1rem",
      letterSpacing: "0.00938em",
      position: "relative",
      alignItems: "flex-start",
    },
    content: {
      height: "calc(100% - 72px)",
      paddingBottom: "16px !important",
    },
    action: {
      position: "absolute",
      right: "5px",
      top: "6px",
    },
  })
);
