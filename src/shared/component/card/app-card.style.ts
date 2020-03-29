import { makeStyles, createStyles } from "@material-ui/core";

export const cardStyles = makeStyles(() =>
  createStyles({
    content: {
      height: "calc(100% - 60px)",
      paddingBottom: "16px !important"
    }
  })
);
