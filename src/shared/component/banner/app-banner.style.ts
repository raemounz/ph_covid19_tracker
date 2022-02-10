import { createStyles, makeStyles } from "@mui/styles";

import { Constants } from "../../Constants";

export const bannerStyles = makeStyles(() =>
  createStyles({
    container: {
      display: "flex",
    },
    banner: {
      padding: "10px 6px 10px 16px",
      height: 140,
      width: "100%",
      fontSize: "1.6em",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
    },
    selectable: {
      cursor: "pointer",
      "&:hover": {
        borderRight: `${Constants.dailyConfirmedColor} 12px solid !important`,
      },
    },
    value: {
      fontSize: "2.1em",
      display: "flex",
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    inProgressValue: {
      color: "transparent",
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
