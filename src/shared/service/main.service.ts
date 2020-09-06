/* eslint-disable no-unused-vars */
import axios from "axios";

export interface PHCase {
  Admitted: string;
  Age: string;
  AgeGroup: string;
  CaseCode: string;
  DateDied: string;
  DateRecover: string;
  DateRepConf: string;
  DateRepRem: string;
  MunCityPSGC: string;
  CityMunRes: string;
  ProvPSGC: string;
  RegionPSGC: string;
  RegionRes: string;
  RemovalType: RemovalType;
  Sex: string;
  DateSpecimen: string;
  DateOnset: string;
}

export enum RemovalType {
  Recovered = "RECOVERED",
  Died = "DIED",
}

export enum CaseType {
  All = "All",
  Active = "Active",
  Confirmed = "Confirmed",
  Recovered = "Recovered",
  Deaths = "Deaths",
}

class MainService {
  getPHCases(url: string): Promise<any> {
    return axios.get(`${url}/data/cases.csv`);
  }

  getGlobalCases(): Promise<any> {
    return axios.get("https://corona.lmao.ninja/v2/countries");
  }
}

export const mainService = new MainService();
