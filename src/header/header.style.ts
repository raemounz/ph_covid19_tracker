import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";

export const headerStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "row",
    },
    title: {
      display: "flex",
      flexDirection: "row",
      margin: "auto 0",
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
      },
    },
    date: {
      [theme.breakpoints.down("xs")]: {
        fontSize: ".7em",
        marginBottom: "5px",
      },
      fontWeight: "normal",
    },
    about: {
      display: "flex",
      flexDirection: "column",
      width: "400px",
      maxWidth: "calc(100vw - 80px)",
      padding: "0 24px 24px 24px",
    },
    flag: {
      width: "55px",
      height: "36px",
      margin: "auto 15px auto 0",
    },
    link: {
      textDecoration: "none",
    },
  })
);
