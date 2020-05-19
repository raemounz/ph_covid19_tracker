import React, { useState } from "react";
import moment from "moment";
import { headerStyles } from "./header.style";
import { IconButton, Dialog, DialogTitle } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

interface Props {
  date: string;
}

const Header: React.FC<Props> = (props: Props) => {
  const classes = headerStyles();
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <div>PH COVID-19 Tracker&nbsp;</div>
        <div className={classes.date}>
          (as of {moment(props.date, "YYYY-MM-DD").format("ll")})
        </div>
      </div>
      <span style={{ flexGrow: 1 }}></span>
      <IconButton style={{ color: "#fff" }} onClick={() => setShowAbout(true)}>
        <InfoOutlinedIcon />
      </IconButton>
      <Dialog onClose={() => setShowAbout(false)} open={showAbout}>
        <DialogTitle>PH COVID-19 Tracker</DialogTitle>
        <div className={classes.about}>
          <div>
            This website provides timely information of COVID-19 cases in the
            Philippines.
          </div>
          <div style={{ marginTop: "10px" }}>Sources:</div>
          <ul>
            <li>Department of Health of the Philippines (DOH)</li>
            <li>NovelCOVID/API</li>
          </ul>
          <div style={{ marginTop: "10px" }}>Developed by</div>
          <div>Raymond Halim</div>
        </div>
      </Dialog>
    </div>
  );
};

export default Header;
