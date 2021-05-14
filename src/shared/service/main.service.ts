/* eslint-disable no-unused-vars */
import axios from "axios";

export enum CaseType {
  All = "All",
  Active = "Active",
  Confirmed = "Confirmed",
  Recovered = "Recovered",
  Deaths = "Deaths",
}

class MainService {
  getReportDate(): Promise<any> {
    return axios.get(`/asof`);
  }

  getAreas(): Promise<any> {
    return axios.get(`/areas`);
  }

  getSummary(region: string, city: string): Promise<any> {
    return axios.get(`/summary?region=${region}&city=${city}`);
  }

  getTimeseries(region: string, city: string): Promise<any> {
    return axios.get(`/timeseries?region=${region}&city=${city}`);
  }

  getTop30Cities(): Promise<any> {
    return axios.get(`/top?limit=30`);
  }

  getAgeGroup(): Promise<any> {
    return axios.get(`/agegroup`);
  }

  getGlobalCases(): Promise<any> {
    return axios.get(`https://corona.lmao.ninja/v2/countries`);
  }
}

export const mainService = new MainService();
