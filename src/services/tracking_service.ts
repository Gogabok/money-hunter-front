import {AuthService} from "@/services/auth_service";
import {TrackingRepository} from "@/repositories/tracking_repository";
import {VuexTrackingStateGroupItemInterface} from "@/store/modules/tracking";
import {AxiosError} from "axios";
import moment from "moment";
import FileSaver from "file-saver";
import {AmplitudeService} from "@/services/amplitude_service";

export class TrackingService {
  private authService = AuthService.getInstance();
  private repo = new TrackingRepository();

  async getBrands(): Promise<[{ brand: string }] | []> {
    try {
      const cached = localStorage.getItem('brands');
      const cached_moment = moment.utc(localStorage.getItem('brands_ts'));
      const now = moment.utc();
      if (cached && cached_moment.isValid() && now.diff(cached_moment, 'hours') < 24) {
        return JSON.parse(cached);
      } else {
        const data = (await this.authService.refreshWrapper(this.repo.getBrands.bind(this.repo))).data.brands;
        localStorage.setItem('brands', JSON.stringify(data));
        localStorage.setItem('brands_ts', moment.utc().toISOString());

        return data;
      }

    } catch (e) {
      return [];
    }
  }

  async getUserGroups(): Promise<[VuexTrackingStateGroupItemInterface] | []> {
    try {
      return (await this.authService.refreshWrapper(this.repo.getUserGroups.bind(this.repo))).data.groups;
    } catch (e) {
      return [];
    }
  }

  async createUpdateGroup(groupName: string, items: [string], addBrands: boolean) {
    try {
      AmplitudeService.trackingSave(
        addBrands ? 'Бренд' : 'Артикул',
        items
      );
      const response = await this.authService.refreshWrapper(this.repo.addGoodsPosition.bind(this.repo, groupName, items, addBrands));
      return response.status === 201;
    } catch (e) {
      return false;
    }
  }

  async getGroupGoods(groupName: string, orderType: string) {
    try {
      return (await this.authService.refreshWrapper(this.repo.getGroupGoods.bind(this.repo, groupName, orderType))).data.detail;
    } catch (e) {
      return null;
    }
  }

  async updateGroupName(groupName: string, newName: string): Promise<boolean | string> {
    try {
      const response = await this.authService.refreshWrapper(this.repo.updateGroupName.bind(this.repo, groupName, newName));
      return response.status === 200;
    } catch (e) {
      const _e = e as AxiosError;

      return _e.response?.data.detail;
    }
  }

  async deleteGroup(groupName: string) {
    try {
      const response = await this.authService.refreshWrapper(this.repo.deleteGroup.bind(this.repo, groupName));
      return response.status === 200;
    } catch (e) {
      const _e = e as AxiosError;

      return _e.response?.data.detail;
    }
  }

  async getRatingAndSizes(groupName: string, articul: string) {
    try {
      return (await this.authService.refreshWrapper(this.repo.getRatingAndSizes.bind(this.repo, groupName, articul))).data;
    } catch (e) {
      const _e = e as AxiosError;

      return _e.response?.data.detail;
    }
  }

  async getProductInfoByArticul(articul: string): Promise<string | Record<string, any>> {
    try {
      return (await this.authService.refreshWrapper(this.repo.getProductInfoByArticul.bind(this.repo, articul))).data;
    } catch (e) {
      const _e = e as AxiosError;

      return _e.response?.data.detail || e.message;
    }
  }

  async deleteProductFromTracking(groupName: string, articul: string) {
    try {
      const response = await this.authService.refreshWrapper(this.repo.deleteProductFromTracking.bind(this.repo, groupName, articul));
      return response.status === 200;
    } catch (e) {
      const _e = e as AxiosError;

      return _e.response?.data.detail || e.message;
    }
  }

  async getGroupInfoBySizeFile(groupName: string): Promise<string> {
    try {
      const response = await this.authService.refreshWrapper(this.repo.getGroupInfoBySizeFile.bind(this.repo, groupName));
      const headers = response.headers;
      const blob = new Blob([`\uFEFF ${response.data}`], { type: headers['content-type'] });
      FileSaver.saveAs(blob, `Moneyhunter_stat.csv`);
      return 'Файл успешно скачен'
    } catch (e) {
      console.log('Cannot download file', e);
      return 'Невозможно скачать файл' + e
    }
  }

  async getGroupInfoByArticulFile(groupName: string): Promise<string> {
    try {
      const response = await this.authService.refreshWrapper(this.repo.getGroupInfoByArticulFile.bind(this.repo, groupName));
      const headers = response.headers;
      const blob = new Blob([`\uFEFF ${response.data}`], { type: headers['content-type'] });
      FileSaver.saveAs(blob, `Moneyhunter_stat.csv`);
      return 'Файл успешно скачен'
    } catch (e) {
      console.log('Cannot download file', e);
      return 'Невозможно скачать файл' + e
    }
  }

  async getGroupSortFile(groupName: string, days: number): Promise<void> {
    try {
      const response = await this.authService.refreshWrapper(this.repo.getGroupSortFile.bind(this.repo, groupName, days));
      const headers = response.headers;
      const blob = new Blob([`\uFEFF ${response.data}`], {type: headers['content-type']});

      FileSaver.saveAs(blob, `Moneyhunter_autosort.csv`);
    } catch (e) {
      console.log('Cannot download file', e);
    }
  }

  async getGroupNotification(notificationId: number) {
    try {
      const response = await this.authService.refreshWrapper(this.repo.getGroupNotification.bind(this.repo, notificationId));
      if (response.status === 200) {
        return response.data;
      } else if(response.status === 403) {
        return response.data.detail.toString();
      } else {
        return "Произошла ошибка";
      }
    } catch (e) {
      return "Произошла ошибка";
    }
  }

  async putGroupNotification(notificationId: number, data: { new_feedback: boolean, stocks_gain: boolean, price_change: number, min_quantity: number }) {
    try {
      return await this.authService.refreshWrapper(this.repo.putGroupNotification.bind(this.repo, notificationId, data));
     } catch (e) {
      return "Произошла ошибка";
    }
  }

  async getGroupChart(groupPK: number) {
    try {
      return await this.authService.refreshWrapper(this.repo.getGroupChart.bind(this.repo, groupPK));
    } catch (e) {
      return "Произошла ошибка";
    }
  }
}