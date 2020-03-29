import { makeStyles, createStyles } from "@material-ui/core";

export const progressStyles = makeStyles(() =>
  createStyles({
    container: {
      display: "flex",
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center"
    }
  })
);
