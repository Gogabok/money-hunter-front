import {ApiClient} from "@/http/api_client";
import {queryParamsBuilder, queryStringBuilder} from "@/helpers";

export type RangeOfIntegersType = [number, number];

export interface GetSearchIDDataInterface {
  priceRange: RangeOfIntegersType;
  ordersRange: RangeOfIntegersType;
  ratingRange: RangeOfIntegersType;
  feedbackRange: RangeOfIntegersType;
  revenueRange: RangeOfIntegersType;
  categories: Array<number>;
  addWords: Array<string>;
  minusWords: Array<string>;
  brands: Array<string>;
  days: number;
  name: string;
}

export class BlackboxRepository {
  private client = new ApiClient();

  private getNewSearchIDUrl = 'wb/blackbox/search/token/';
  private getGoodsBySearchIDUrl = 'wb/blackbox/search/';
  private findSearchIDByNameUrl = 'wb/blackbox/user/searches/{name}/';
  private searchesUrl = 'wb/blackbox/user/searches/';
  private getProductImagePathAndNameUrl = 'wb/blackbox/product/information/{articul}/';
  private getChartDataUrl = 'wb/blackbox/product/charts/{articul}/';
  private getCategoriesUrl = 'wb/blackbox/categories/';
  private deleteSearchUrl = 'wb/blackbox/user/searches/';
  private getAgregatedDataUrl = 'wb/blackbox/agregated/';
  private downloadSearchResultsUrl = 'wb/blackbox/download/'

  getNewSearchID(data: GetSearchIDDataInterface) {
    return this.client.sendPost(this.getNewSearchIDUrl, data);
  }

  findSearchIDByName(name: string) {
    return this.client.sendGet(queryStringBuilder(this.findSearchIDByNameUrl, {name}));
  }

  getGoodsBySearchID(searchID: string, orderType: string, pageNum: number, onPage: number) {
    const params = { searchID, orderType, pageNum, onPage } as any;
    const paramsString = queryParamsBuilder(params);

    return this.client.sendGet(`${this.getGoodsBySearchIDUrl}?${paramsString}`);
  }

  downloadSearchResults(searchID: string, orderType: string) {
    const params = { searchID, orderType } as any;

    return this.client.sendGet(
      queryStringBuilder(this.downloadSearchResultsUrl, params),
      { responseType: 'blob' }
    );
  }

  getSavedSearches() {
    return this.client.sendGet(this.searchesUrl);
  }

  deleteSearch(pk: number) {
    return this.client.sendDelete(`${this.deleteSearchUrl}${pk}/`)
  }

  addSearch(name: string, data: GetSearchIDDataInterface) {
    const _data = {...data} as any;
    _data.name = name;
    return this.client.sendPost(this.searchesUrl, _data);
  }

  updateSearch(pk: number, name: string, data: GetSearchIDDataInterface) {
    const _data = {...data} as any;
    _data.name = name;
    return this.client.sendPut(`${this.searchesUrl}${pk}/`, _data);
  }

  getProductImagePathAndName(articul: string) {
    return this.client.sendGet(queryStringBuilder(this.getProductImagePathAndNameUrl, {articul}))
  }

  getChartData(articul: string, days: number) {
    return this.client.sendGet(queryStringBuilder(this.getChartDataUrl, { articul, days }))
  }

  getCategories() {
    return this.client.sendGet(this.getCategoriesUrl);
  }

  getAgregatedData(searchID: any) {
    return this.client.sendGet(queryStringBuilder(this.getAgregatedDataUrl, { searchID }))
  }
}