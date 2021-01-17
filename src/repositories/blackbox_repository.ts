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
  ids: Array<string>;
  providers_ids: Array<string>;
  categoryOptions: Array<number> | null;
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
  private getCategoryUrl = 'wb/blackbox/category/';
  private deleteSearchUrl = 'wb/blackbox/user/searches/';
  private getAgregatedDataUrl = 'wb/blackbox/agregated/';
  private downloadSearchResultsUrl = 'wb/blackbox/download/';
  private getCalculatorDataUrl = 'wb/blackbox/calculator/{pk}';
  private getProvidersUrl = 'wb/blackbox/providers/'
  private getCategoriesBySearchUrl = 'wb/blackbox/category/search/'

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

  getCategory(payload: any) {
    const id = payload.id;
    const children = payload.children;
    console.log(payload)
    if(id && children) {
      return this.client.sendGet(queryStringBuilder(this.getCategoryUrl, { id, children }));
    } else if (id && !children) {
      return this.client.sendGet(queryStringBuilder(this.getCategoryUrl, { id }));
    }
    return this.client.sendGet(this.getCategoryUrl);
  }

  getAgregatedData(searchID: any) {
    return this.client.sendGet(queryStringBuilder(this.getAgregatedDataUrl, { searchID }))
  }

  getCalculatorData(pk: number) {
    return this.client.sendGet(queryStringBuilder(this.getCalculatorDataUrl, { pk }))
  }

  getProviders() {
    return this.client.sendGet(this.getProvidersUrl);
  }

  getCategoriesBySearch(name: string) {
    return this.client.sendGet(queryStringBuilder(this.getCategoriesBySearchUrl, { name }));
  }
}