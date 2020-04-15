import React, { useEffect, useState } from "react";
import { mainService } from "../../shared/service/main.service";
import {
  List,
  ListItem,
  createMuiTheme,
  useMediaQuery,
} from "@material-ui/core";
import { globalListStyles } from "./global-list.style";
import AppProgress from "../../shared/component/progress/AppProgress";
import clsx from "clsx";

const GlobalList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const classes = globalListStyles();
  const theme = createMuiTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));

  useEffect(() => {
    mainService.getGlobalCases().then((response: any) => {
      setCases(
        response.data
          .map((d: any) => {
            return {
              country: d.country,
              flag: d.countryInfo.flag,
              cases: d.cases,
              recovered: d.recovered,
              deaths: d.deaths,
            };
          })
          .sort((a, b) => b.cases - a.cases)
      );
      setIsLoading(false);
    });
  }, []);
  return (
    <>
      {isLoading ? (
        <AppProgress />
      ) : (
        <List>
          {cases.map((d: any, index: number) => {
            return (
              <ListItem
                key={d.country}
                style={{ paddingRight: "8px", paddingLeft: "8px" }}
                className={clsx({ [classes.odd]: index % 2 === 0 })}
              >
                <div
                  className={clsx(classes.container, {
                    [classes.containerCol]: matches,
                  })}
                >
                  <div className={classes.flagCountry}>
                    <img src={d.flag} className={classes.flag}></img>
                    <div className={classes.country}>{d.country}</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: matches ? "10px" : 0,
                    }}
                  >
                    <div className={`${classes.metric} ${classes.cases}`}>
                      {d.cases ? d.cases.toLocaleString() : "-"}
                    </div>
                    <div className={`${classes.metric} ${classes.recovered}`}>
                      {d.recovered ? d.recovered.toLocaleString() : "-"}
                    </div>
                    <div className={`${classes.metric} ${classes.deaths}`}>
                      {d.deaths ? d.deaths.toLocaleString() : "-"}
                    </div>
                  </div>
                </div>
              </ListItem>
            );
          })}
        </List>
      )}
    </>
  );
};

export default GlobalList;
