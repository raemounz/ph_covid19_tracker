import React, { useEffect, useState } from "react";
import { mainService } from "../../shared/service/main.service";
import { List, ListItem } from "@material-ui/core";
import { globalListStyles } from "./global-list.style";
import AppProgress from "../../shared/component/progress/AppProgress";

const GlobalList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const classes = globalListStyles();

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
          {cases.map((d: any) => {
            return (
              <ListItem key={d.country}>
                <div className={classes.container}>
                  <img src={d.flag} className={classes.flag}></img>
                  <div className={classes.country}>{d.country}</div>
                  <div className={classes.cases}>
                    {d.cases.toLocaleString()}
                  </div>
                  <div className={classes.recovered}>
                    {d.recovered.toLocaleString()}
                  </div>
                  <div className={classes.deaths}>
                    {d.deaths.toLocaleString()}
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
