// eslint-disable-next-line no-unused-vars
import { makeStyles, createStyles, Theme } from "@material-ui/core";

export const headerStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "row"
    },
    title: {
      display: "flex",
      flexDirection: "row",
      margin: "auto 0",
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column"
      }
    },
    date: {
      [theme.breakpoints.down("xs")]: {
        fontSize: ".7em",
        marginBottom: "5px"
      }
    }
  })
);
