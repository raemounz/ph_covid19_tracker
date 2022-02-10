import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FormControl, List, ListItem, MenuItem, Select } from "@mui/material";

import { mainService } from "../../shared/service/main.service";
import { globalListStyles } from "./global-list.style";
import AppProgress from "../../shared/component/progress/AppProgress";
import AppCard from "../../shared/component/card/AppCard";
import { Constants } from "../../shared/Constants";

const GlobalList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const classes = globalListStyles();
  const theme = createTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const others = "Others";
  const allCountries = "All Countries";
  const southEastAsia = "Southeast Asia";
  const listDivId = "globalCasesList";
  const [continentMap, setContinentMap] = useState({});
  const [continent, setContinent] = useState(southEastAsia);
  const southEastCountries = [
    "Brunei",
    "Cambodia",
    "Timor-Leste",
    "Indonesia",
    "Lao People's Democratic Republic",
    "Malaysia",
    "Myanmar",
    "Philippines",
    "Singapore",
    "Thailand",
    "Vietnam",
  ];

  const legends = [
    { label: "Active", background: Constants.activeColor },
    { label: "Confirmed", background: Constants.confirmedColor },
    { label: "Recovered", background: Constants.recoveredColor },
    { label: "Deaths", background: Constants.deathColor },
  ];

  useEffect(() => {
    const _continentMap = {};
    mainService.getGlobalCases().then((response: any) => {
      setCases(
        response.data
          .map((d: any) => {
            const continentValue = d.continent || others;
            if (!_continentMap[continentValue]) {
              _continentMap[continentValue] = [];
            }
            _continentMap[continentValue].push(d.country);
            return {
              country: d.country,
              flag: d.countryInfo.flag,
              cases: d.cases,
              recovered: d.recovered,
              deaths: d.deaths,
              continent: continentValue,
            };
          })
          .sort((a, b) => b.cases - a.cases)
      );
      setContinentMap(_continentMap);
      setIsLoading(false);
    });
  }, []);

  const onChangeContinent = (event: any) => {
    setContinent(event.target.value);
    const list = document.getElementById(listDivId);
    if (list) {
      list.scrollTop = 0;
    }
  };

  const filterCountries = () => {
    return cases.filter((c: any) => {
      if (continent === allCountries) {
        return true;
      } else if (continent === southEastAsia) {
        return southEastCountries.includes(c.country);
      }
      return continent === c.continent;
    });
  };

  return (
    <AppCard
      id="globalCases"
      title="Cases"
      style={{
        height: "542px",
        content: {
          height: "calc(100% - 60px)",
          paddingTop: 0,
        },
      }}
      selection={
        <FormControl
          variant="outlined"
          size="small"
          color="secondary"
          className={classes.selection}
        >
          <Select value={continent} onChange={onChangeContinent}>
            {[allCountries].map((option: string) => {
              const options = [
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>,
                <MenuItem key={southEastAsia} value={southEastAsia}>
                  {southEastAsia}
                </MenuItem>,
              ];
              Object.keys(continentMap).forEach((_continent: string) => {
                options.push(
                  <MenuItem key={_continent} value={_continent}>
                    {_continent}
                  </MenuItem>
                );
              });
              return options;
            })}
          </Select>
        </FormControl>
      }
      content={
        <>
          {isLoading ? (
            <AppProgress />
          ) : (
            <div
              style={{
                display: isLoading ? "none" : "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div className={classes.legend}>
                {legends.map((legend: any) => {
                  return (
                    <div className={classes.legendItem} key={legend.label}>
                      <div
                        className={classes.legendBox}
                        style={{ background: legend.background }}
                      ></div>
                      <div className={classes.legendLabel}>{legend.label}</div>
                    </div>
                  );
                })}
              </div>
              <div
                id={listDivId}
                style={{ height: "100%", flexGrow: 1, overflow: "auto" }}
              >
                <List>
                  {filterCountries().map((d: any, index: number) => {
                    return (
                      <ListItem
                        key={d.country}
                        style={{ paddingRight: 8, paddingLeft: 8 }}
                        className={clsx(
                          { [classes.odd]: index % 2 === 0 },
                          classes.listItem
                        )}
                      >
                        <div
                          className={clsx(classes.container, {
                            [classes.containerCol]: matches,
                          })}
                        >
                          <div className={classes.flagCountry}>
                            <img
                              src={d.flag}
                              alt={d.country}
                              className={classes.flag}
                            ></img>
                            <div className={classes.country}>{d.country}</div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              marginTop: matches ? 10 : 0,
                              overflow: "auto",
                            }}
                          >
                            <div
                              className={`${classes.metric} ${classes.active}`}
                            >
                              {(
                                d.cases -
                                d.recovered -
                                d.deaths
                              ).toLocaleString()}
                            </div>
                            <div
                              className={`${classes.metric} ${classes.cases}`}
                            >
                              {d.cases?.toLocaleString()}
                            </div>
                            <div
                              className={`${classes.metric} ${classes.recovered}`}
                            >
                              {d.recovered?.toLocaleString()}
                            </div>
                            <div
                              className={`${classes.metric} ${classes.deaths}`}
                            >
                              {d.deaths?.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            </div>
          )}
        </>
      }
    ></AppCard>
  );
};

export default GlobalList;
