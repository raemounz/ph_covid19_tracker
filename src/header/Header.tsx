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
      <IconButton color="secondary" onClick={() => setShowAbout(true)}>
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
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://www.doh.gov.ph/"
                className={classes.link}
              >
                Department of Health of the Philippines (DOH)
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/disease-sh/API"
                className={classes.link}
              >
                NovelCOVID/API
              </a>
            </li>
          </ul>
          <div style={{ marginTop: "10px" }}>Developed by</div>
          <div>Raymond Halim</div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://raymondhalim.com"
            className={classes.link}
          >
            http://raymondhalim.com
          </a>
        </div>
      </Dialog>
    </div>
  );
};

export default Header;
