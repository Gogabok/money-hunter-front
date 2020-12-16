import axios, {AxiosRequestConfig} from 'axios';
import {TokenService, TokenType} from "@/services/token_service";

export class ApiClient {
  static API_VERSION_EMPTY = '';
  static API_VERSION_V1 = 'v1/';

  private baseUrl = 'http://213.139.211.239:8082/api/';

  private generateUrl(url: string, apiVersion = ApiClient.API_VERSION_V1) {
    return (apiVersion ? apiVersion : '') + url;
  }

  private getBasicClient() {
    const client = axios.create();

    client.defaults.baseURL = this.baseUrl;
    client.defaults.headers.common['Accept'] = 'application/json';
    client.defaults.headers.post['Content-Type'] = 'application/json';

    return client;
  }

  private getClient() {
    const client = this.getBasicClient();
    const tokenService = new TokenService();

    if (tokenService.hasToken(TokenType.ACCESS_TOKEN)) {
      client.defaults.headers.common['Authorization'] = `Bearer ${tokenService.getToken(TokenType.ACCESS_TOKEN)}`;
    }

    return client;
  }

  sendPost(url: string, body: Record<string, any>, apiVersion = ApiClient.API_VERSION_V1) {
    const _url = this.generateUrl(url, apiVersion);

    return this.getClient().post(_url, body);
  }

  sendGet(url: string, config?: AxiosRequestConfig, apiVersion = ApiClient.API_VERSION_V1) {
    const _url = this.generateUrl(url, apiVersion);
    return this.getClient().get(_url);
  }

  sendPut(url: string, body: Record<string, any>, apiVersion = ApiClient.API_VERSION_V1) {
    const _url = this.generateUrl(url, apiVersion);

    return this.getClient().put(_url, body);
  }

  sendDelete(url: string, apiVersion = ApiClient.API_VERSION_V1) {
    const _url = this.generateUrl(url, apiVersion);

    return this.getClient().delete(_url);
  }

  refreshToken(url: string, token: string) {
    const client = this.getBasicClient();
    const _url = this.generateUrl(url, ApiClient.API_VERSION_V1);

    return client.post(_url, { refresh: token });
  }
}