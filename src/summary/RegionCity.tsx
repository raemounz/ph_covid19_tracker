import React, { useEffect, useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  ListSubheader,
} from "@material-ui/core";
import { mainService } from "../shared/service/main.service";
import { Constants } from "../shared/Constants";

interface Props {
  // eslint-disable-next-line no-unused-vars
  onChangeRegionCity: (regionCity: any) => void;
}

const RegionCity: React.FC<Props> = (props: Props) => {
  const [regionMap, setRegionMap] = useState({});
  const [regionCity, setRegionCity] = useState<any>({
    region: Constants.allRegions,
    city: Constants.allCities,
  });

  useEffect(() => {
    mainService.getAreas().then((response: any) => {
      // Exclude 'For Validation' records
      const _responseData = response.data;
      delete _responseData[Constants.forValidation];
      setRegionMap(_responseData);
    });
  }, []);

  const onChangeProvince = (event: any) => {
    const _regionCIty = {
      region: event.target.value,
      city: Constants.allCities,
    };
    setRegionCity(_regionCIty);
    props.onChangeRegionCity(_regionCIty);
  };

  const onChangeCity = (event: any) => {
    const _regionCIty = {
      region: regionCity.region,
      city: event.target.value,
    };
    setRegionCity(_regionCIty);
    props.onChangeRegionCity(_regionCIty);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FormControl
        variant="outlined"
        style={{ width: "100%", marginBottom: "5px" }}
      >
        <Select value={regionCity.region} onChange={onChangeProvince}>
          <MenuItem value={Constants.allRegions} style={{ fontSize: ".9em" }}>
            {Constants.allRegions}
          </MenuItem>
          {Object.keys(regionMap)
            .sort()
            .map((r: string) => {
              return (
                <MenuItem key={r} value={r} style={{ fontSize: ".9em" }}>
                  {r}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ width: "100%" }}>
        <Select value={regionCity.city} onChange={onChangeCity}>
          <MenuItem
            id={`${regionCity.region}|${Constants.allCities}`}
            value={Constants.allCities}
            style={{ fontSize: ".9em" }}
          >
            {Constants.allCities}
          </MenuItem>
          {regionCity.region === Constants.allRegions
            ? Object.keys(regionMap)
                .sort()
                .map((r: string) => {
                  const group = [<ListSubheader key={r}>{r}</ListSubheader>];
                  Array.from(regionMap[r])
                    .sort()
                    .forEach((c: any) => {
                      group.push(
                        <MenuItem
                          id={`${r}|${c}`}
                          key={`${r}|${c}`}
                          value={c}
                          style={{ fontSize: ".9em" }}
                        >
                          {c}
                        </MenuItem>
                      );
                    });
                  return group;
                })
            : Array.from(regionMap[regionCity.region])
                .sort()
                .map((c: any) => {
                  return (
                    <MenuItem
                      id={`${regionCity.region}|${c}`}
                      key={`${regionCity.region}|${c}`}
                      value={c}
                      style={{ fontSize: ".9em" }}
                    >
                      {c}
                    </MenuItem>
                  );
                })}
        </Select>
      </FormControl>
    </div>
  );
};

export default RegionCity;
