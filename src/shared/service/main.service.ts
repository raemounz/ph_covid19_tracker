import axios from "axios";

const nameMap = {
  "City of Manila": "Manila City",
  "City of Makati": "Makati City",
  "City of Makati, NCR, Fourth District": "Makati City",
  "City of Pasig": "Pasig City",
  "City of Pasig, NCR, Second District": "Pasig City",
  "City of San Juan": "San Juan City",
  "City of San Juan, NCR, Second District": "San Juan City",
  "City of Parañaque": "Parañaque City",
  "City of Parañaque, NCR, Fourth District": "Parañaque City",
  "City of Mandaluyong": "Mandaluyong City",
  "City of Mandaluyong, NCR, Second District": "Mandaluyong City",
  "City of Muntinlupa": "Muntinlupa City",
  "City of Muntinlupa, NCR, Fourth District": "Muntinlupa City",
  "City of Marikina": "Marikina City",
  "City of Marikina, NCR, Second District": "Marikina City",
  "City of Las Piñas": "Las Piñas City",
  "City of Las Piñas, NCR, Fourth District": "Las Piñas City",
  "City of Antipolo , Rizal": "Antipolo City, Rizal",
  "Cebu City , Cebu": "Cebu City, Cebu",
  "City of Valenzuela": "Valenzuela City",
  "City of Valenzuela, NCR, Third District": "Valenzuela City",
  "City of Malabon": "Malabon City",
  "City of Malabon, NCR, Third District": "Malabon City",
  "Batangas City , Batangas": "Batangas City, Batangas",
  "City of Biñan, Laguna": "Biñan City, Laguna",
  "City of Santa Rosa, Laguna": "Santa Rosa City, Laguna",
  "City of San Pedro, Laguna": "San Pedro City, Laguna",
  "San Jose del Monte City": "San Jose Del Monte City, Bulacan",
  "City of San Jose Del Monte, Bulacan": "San Jose Del Monte City, Bulacan",
  "Tuguegarao City , Cagayan": "Tuguegarao City, Cagayan",
  "City of Malolos , Bulacan": "Malolos City, Bulacan",
  "City of Calamba, Laguna": "Calamba City, Laguna",
  "Bacolod City , Negros Occidental": "Bacolod City, Negros Occidental",
  "City of Gapan, Nueva Ecija": "Gapan City, Nueva Ecija",
  "City of Dasmariñas, Cavite": "Dasmariñas City, Cavite",
  "City of General Trias, Cavite": "General Trias City, Cavite",
  "Marawi City , Lanao Del Sur": "Marawi City, Lanao Del Sur",
  "City of Meycauayan, Bulacan": "Meycauayan City, Bulacan",
  "City of Tagum , Davao Del Norte": "Tagum City, Davao Del Norte",
  "City of Tanauan, Batangas": "Tanauan City, Batangas",
  "Quezon City, NCR, Second District": "Quezon City",
  "Taguig City, NCR, Fourth District": "Taguig City",
  "Caloocan City, NCR, Third District": "Caloocan City",
  "Pasay City, NCR, Fourth District": "Pasay City",
  "Pateros, NCR, Fourth District": "Pateros",
  Navotas: "Navotas City",
  "City of Navotas, NCR, Third District": "Navotas City",
  "City of San Fernando , Pampanga": "San Fernando City, Pampanga",
  "Rodriguez (Montalban), Rizal": "Rodriguez, Rizal",
  "Iloilo City , Iloilo": "Iloilo City, Iloilo",
  "Cotabato City, Cotabato City": "Cotabato City, Maguindanao",
  "City of Mati , Davao Oriental": "Mati City, Davao Oriental",
  "City of Tarlac , Tarlac": "Tarlac City, Tarlac",
  "Lapu-Lapu City (Opon), Cebu": "Lapu-Lapu City, Cebu",
  "Lucena City , Quezon": "Lucena City, Quezon",
  "Kalibo , Aklan": "Kalibo, Aklan",
  "Bayombong , Nueva Vizcaya": "Bayombong, Nueva Vizcaya",
  "Cagayan De Oro City , Misamis Oriental":
    "Cagayan De Oro City, Misamis Oriental",
  "City of Calapan , Oriental Mindoro": "Calapan City, Oriental Mindoro",
  "Calbayog City": "Calbayog City, Samar",
  "City of Balanga , Bataan": "Balanga City, Bataan",
  "Catarman , Northern Samar": "Catarman, Northern Samar",
  "Cavite City": "Cavite City, Cavite",
  "City of Digos , Davao Del Sur": "Digos City, Davao Del Sur",
  "Dumaguete City , Negros Oriental": "Dumaguete City, Negros Oriental",
  "Enrique B. Magalona (Saravia), Negros Occidental":
    "Enrique B. Magalona, Negros Occidental",
  "La Carlota City": "La Carlota City, Negros Occidental",
  "La Trinidad , Benguet": "La Trinidad, Benguet",
  "Lambayong (Mariano Marcos), Sultan Kudarat": "Lambayong, Sultan Kudarat",
  "Legazpi City , Albay": "Legazpi City, Albay",
  "Puerto Princesa City , Palawan": "Puerto Princesa City, Palawan",
  "Roxas City , Capiz": "Roxas City, Capiz",
  "Pagadian City": "Pagadian City, Zamboanga Del Sur",
  "City of Panabo, Davao Del Norte": "Panabo City, Davao Del Norte",
  "City of Talisay, Cebu": "Talisay City, Cebu",
  "City of Urdaneta, Pangasinan": "Urdaneta City, Pangasinan",
  "Tayabas City": "Tayabas City, Quezon",
  "Datu Odin Sinsuat": "Datu Odin Sinsuat, Maguindanao",
  "Marawi City, Lanao del Sur": "Marawi City, Lanao Del Sur",
};

export const getMapName = (name: string) => {
  return nameMap[name] || name;
};

class MainService {
  getSummary(): Promise<any> {
    return axios.get(
      "https://api.coronatracker.com/v3/stats/worldometer/country?countryCode=PH"
    );
  }

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
    return axios.get("https://corona.lmao.ninja/v2/historical/philippines?lastdays=all");
  }

  getGlobalCases(): Promise<any> {
    return axios.get("https://corona.lmao.ninja/v2/countries");
  }
}

export const mainService = new MainService();
