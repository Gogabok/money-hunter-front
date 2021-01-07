import { ApiClient } from "@/http/api_client";
import { queryStringBuilder } from "@/helpers";

export class TrackingRepository {
  private client = new ApiClient();

  private getBrandsUrl = 'wb/tracking/brands/';
  private getUserGroupsUrl = 'wb/tracking/user/groups/';
  private createUpdateGroup = 'wb/tracking/user/groups/';
  private groupDataUrl = 'wb/tracking/user/groups/{groupName}/';
  private productDataUrl = 'wb/tracking/{groupName}/{articul}/';
  private getProductInfoByArticulUrl = 'wb/tracking/product/info/{articul}/';
  private getGroupInfoBySizeFileUrl = 'wb/tracking/user/groups/{groupName}/download/sizes/';
  private getGroupInfoByArticulFileUrl = 'wb/tracking/user/groups/{groupName}/download/products/';
  private getGroupSortFileUrl = 'wb/tracking/user/groups/{groupName}/{days}/autosort/';
  private groupNotificationUrl = 'wb/tracking/group/notification/{notificationId}/';

  getBrands() {
    return this.client.sendGet(this.getBrandsUrl);
  }

  getUserGroups() {
    return this.client.sendGet(this.getUserGroupsUrl);
  }

  addGoodsPosition(groupName: string, items: [string], addBrands: boolean) {
    return this.client.sendPost(this.createUpdateGroup, { groupName, items, addBrands });
  }

  getGroupGoods(groupName: string, orderType: string) {
    const url = queryStringBuilder(this.groupDataUrl, { groupName, orderType });
    return this.client.sendGet(url);
  }

  getGroupNotification(notificationId: number) {
    const url = queryStringBuilder(this.groupNotificationUrl, { notificationId });
    return this.client.sendGet(url);
  }

  putGroupNotification(notificationId: number, data: { new_feedback: boolean, stocks_gain: boolean, price_change: number, min_quantity: number }) {
    const url = queryStringBuilder(this.groupNotificationUrl, { notificationId });
    return this.client.sendPut(url, data);
  }

  updateGroupName(groupName: string, newName: string) {
    const url = queryStringBuilder(this.groupDataUrl, { groupName });
    return this.client.sendPut(url, { newName });
  }

  deleteGroup(groupName: string) {
    const url = queryStringBuilder(this.groupDataUrl, { groupName });
    return this.client.sendDelete(url);
  }

  getRatingAndSizes(groupName: string, articul: string) {
    const url = queryStringBuilder(this.productDataUrl, { groupName, articul });
    return this.client.sendGet(url);
  }

  deleteProductFromTracking(groupName: string, articul: string) {
    const url = queryStringBuilder(this.productDataUrl, { groupName, articul });
    return this.client.sendDelete(url);
  }

  getProductInfoByArticul(articul: string) {
    return this.client.sendGet(queryStringBuilder(this.getProductInfoByArticulUrl, { articul }));
  }

  getGroupInfoBySizeFile(groupName: string) {
    return this.client.sendGet(
      queryStringBuilder(this.getGroupInfoBySizeFileUrl, { groupName }),
      { responseType: 'blob' }
    );
  }

  getGroupInfoByArticulFile(groupName: string) {
    return this.client.sendGet(
      queryStringBuilder(this.getGroupInfoByArticulFileUrl, { groupName }),
      { responseType: 'blob' }
    );
  }

  getGroupSortFile(groupName: string, days: number) {
    return this.client.sendGet(
      queryStringBuilder(this.getGroupSortFileUrl, { groupName, days }),
      { responseType: 'blob' }
    )
  }
}