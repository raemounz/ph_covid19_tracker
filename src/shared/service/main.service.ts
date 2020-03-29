import axios from "axios";

class MainService {
  getConfirmedCases(): Promise<any> {
    return axios.get(
      "https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/slide_fig/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22confirmed%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true"
    );
  }

  getPUICases(): Promise<any> {
    return axios.get(
      "https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/slide_fig/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22PUIs%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true"
    );
  }

  getPUMCases(): Promise<any> {
    return axios.get(
      "https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/slide_fig/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22PUMs%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true"
    );
  }

  getRecoveredCases(): Promise<any> {
    return axios.get(
      "https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/slide_fig/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22recovered%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true"
    );
  }

  getDeathCases(): Promise<any> {
    return axios.get(
      "https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/slide_fig/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22deaths%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true"
    );
  }

  getTestsConducted(): Promise<any> {
    return axios.get(
      "https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/slide_fig/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22tests%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true"
    );
  }

  getConfirmedCasesPH(): Promise<any> {
    return axios.get(
      "https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/PH_masterlist/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=sequ%20desc&resultOffset=0&resultRecordCount=1500&cacheHint=true"
    );
  }

  getConfirmedCasesOFW(): Promise<any> {
    return axios.get(
      "https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/OF_masterlist/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=num%20desc&resultOffset=0&resultRecordCount=200&cacheHint=true"
    );
  }

  getConfirmedCasesFN(): Promise<any> {
    return axios.get(
      "https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/FN_masterlist/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=FID%20desc&resultOffset=0&resultRecordCount=25&cacheHint=true"
    );
  }

  getConfirmedCasesByResidence(): Promise<any> {
    return axios.get(
      "https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/PH_masterlist/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&groupByFieldsForStatistics=residence&orderByFields=value%20desc&outStatistics=%5B%7B%22statisticType%22%3A%22count%22%2C%22onStatisticField%22%3A%22FID%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true"
    );
  }

  getConfirmedCasesByAgeGroup(): Promise<any> {
    return axios.get(
      "https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/age_group/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&groupByFieldsForStatistics=age_categ%2Csex&outStatistics=%5B%7B%22statisticType%22%3A%22count%22%2C%22onStatisticField%22%3A%22FID%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true"
    );
  }

  getConfirmedCasesTrends(): Promise<any> {
    return axios.get(
      "https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/confirmed/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=date%20asc&resultOffset=0&resultRecordCount=2000&cacheHint=true"
    );
  }

  getHistorical(): Promise<any> {
    return axios.get("https://corona.lmao.ninja/v2/historical/philippines");
  }
}

export const mainService = new MainService();
