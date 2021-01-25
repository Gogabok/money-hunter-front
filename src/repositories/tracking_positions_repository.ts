import { ApiClient } from "@/http/api_client";
import { queryStringBuilder } from "@/helpers";

export class TrackingPositionsRepository {
  private client = new ApiClient();
  private getUserPositionsUrl = 'wb/positions/products/'
  private getPositionUrl = 'wb/positions/products/'
  private setPositionsUrl = 'wb/positions/products/'

  getUserPositions() {
    return this.client.sendGet(this.getUserPositionsUrl);
  }

  getPosition(articul: string) {
    return this.client.sendGet(`${this.getPositionUrl}${articul}/`);
  }

  setPositions(articules: Array<string>) {
    return this.client.sendPost(this.setPositionsUrl, articules);
  }
}