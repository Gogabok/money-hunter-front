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

  getNewSearchID(data: GetSearchIDDataInterface) {
    return this.client.sendPost(this.getNewSearchIDUrl, data);
  }

  findSearchIDByName(name: string) {
    return this.client.sendGet(queryStringBuilder(this.findSearchIDByNameUrl, {name}));
  }

  getGoodsBySearchID(searchID: string, orderType: string, pageNum: number, onPage: number) {
    const params = {searchID, orderType, pageNum, onPage} as any;
    const paramsString = queryParamsBuilder(params);

    return this.client.sendGet(`${this.getGoodsBySearchIDUrl}?${paramsString}`);
  }

  getSavedSearches() {
    return this.client.sendGet(this.searchesUrl);
  }

  deleteSearch(name: any) {
    return this.client.sendDelete(`${this.deleteSearchUrl}${name}/`)
  }

  saveSearch(name: string, data: GetSearchIDDataInterface) {
    const _data = {...data} as any;
    _data.name = name;

    return this.client.sendPost(this.searchesUrl, _data);
  }

  getProductImagePathAndName(articul: string) {
    return this.client.sendGet(queryStringBuilder(this.getProductImagePathAndNameUrl, {articul}))
  }

  getChartData(articul: string) {
    return this.client.sendGet(queryStringBuilder(this.getChartDataUrl, {articul}))
  }

  getCategories() {
    return this.client.sendGet(this.getCategoriesUrl);
  }

  getAgregatedData(searchID: any) {
    return this.client.sendGet(queryStringBuilder(this.getAgregatedDataUrl, { searchID }))
  }
}