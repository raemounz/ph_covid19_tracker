import React, { useEffect, useState } from "react";
import { mainService } from "../../shared/service/main.service";
import {
  List,
  ListItem,
  createMuiTheme,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
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
  const others = "Others";
  const allCountries = "All Countries";
  const southEastAsia = "Southeast Asia";
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
    { label: "Active", background: "#ffae42" },
    { label: "Confirmed", background: "#ff5500" },
    { label: "Recovered", background: "#38a800" },
    { label: "Deaths", background: "#464646" },
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
  };

  return (
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
          <FormControl
            variant="outlined"
            style={{ minWidth: "150px", marginBottom: "10px" }}
          >
            <Select value={continent} onChange={onChangeContinent}>
              {[allCountries].map((option: string) => {
                const options = [
                  <MenuItem
                    key={option}
                    value={option}
                    style={{ fontSize: ".9em" }}
                  >
                    {option}
                  </MenuItem>,
                  <MenuItem
                    key={southEastAsia}
                    value={southEastAsia}
                    style={{ fontSize: ".9em" }}
                  >
                    {southEastAsia}
                  </MenuItem>,
                ];
                Object.keys(continentMap).map((continent: string) => {
                  options.push(
                    <MenuItem
                      key={continent}
                      value={continent}
                      style={{ fontSize: ".9em" }}
                    >
                      {continent}
                    </MenuItem>
                  );
                });
                return options;
              })}
            </Select>
          </FormControl>
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
          <div style={{ height: "100%", flexGrow: 1, overflow: "auto" }}>
            <List>
              {cases
                .filter((c: any) =>
                  continent === allCountries
                    ? true
                    : continent === southEastAsia
                    ? southEastCountries.includes(c.country)
                    : continent === c.continent
                )
                .map((d: any, index: number) => {
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
                          <div className={`${classes.metric} ${classes.cases}`}>
                            {d.cases ? d.cases.toLocaleString() : "-"}
                          </div>
                          <div
                            className={`${classes.metric} ${classes.recovered}`}
                          >
                            {d.recovered ? d.recovered.toLocaleString() : "-"}
                          </div>
                          <div
                            className={`${classes.metric} ${classes.deaths}`}
                          >
                            {d.deaths ? d.deaths.toLocaleString() : "-"}
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
  );
};

export default GlobalList;
