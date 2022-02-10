import React, { useEffect, useState } from "react";
import { IconButton, Dialog, DialogTitle } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment";

import { headerStyles } from "./header.style";
import { mainService } from "../shared/service/main.service";

const Header: React.FC = () => {
  const classes = headerStyles();
  const [showAbout, setShowAbout] = useState(false);
  const [date, setDate] = useState<any>();

  useEffect(() => {
    mainService.getReportDate().then((response: any) => {
      setDate(response.data.date);
    });
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <div>PH COVID-19 Tracker&nbsp;</div>
        <div className={classes.date}>
          (as of {date && moment(date, "YYYY-MM-DD").format("ll")})
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
                href="https://doh.gov.ph/"
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
