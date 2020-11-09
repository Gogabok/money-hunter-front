import {BlackboxRepository, GetSearchIDDataInterface, RangeOfIntegersType} from "@/repositories/blackbox_repository";
import { AuthService } from "@/services/auth_service";
import FileSaver from "file-saver";
import {AmplitudeService} from "@/services/amplitude_service";

export class BlackboxService {
  private repo = new BlackboxRepository();
  private service = AuthService.getInstance();

  public normalizeFilterData(data: GetSearchIDDataInterface): GetSearchIDDataInterface {
    const _data = {} as GetSearchIDDataInterface;
    _data.feedbackRange = this.normalizeRangeData({data: data.feedbackRange, min: 0, max: 900000});
    _data.ordersRange = this.normalizeRangeData({ data: data.ordersRange, min: 0, max: 900000 });
    _data.priceRange = this.normalizeRangeData({ data: data.priceRange, min: 1, max: 900000 });
    _data.ratingRange = this.normalizeRangeData({ data: data.ratingRange, min: 0, max: 5 });
    _data.revenueRange = this.normalizeRangeData({ data: data.revenueRange, min: 0, max: 900000 });
    _data.brands = [...data.brands];
    _data.categories = [...data.categories];
    _data.addWords = [...data.addWords];
    _data.minusWords = [...data.minusWords];

    return _data;
  }

  private normalizeRangeData = (data: any): RangeOfIntegersType => {
    const _data = Array<number>(2);
    // если данных нет или ни не соответствуют условию
    // _data[0] = (!data[0] || data[0] < 0) ? 0 : data[0];
    // _data[1] = (!data[1] || data[1] > 900000) ? 900000 : data[1];
    if (!data.data[0] || data.data[0] < data.min) {
      _data[0] = data.min
    } else {
      _data[0] = data.data[0]
    }
    if (!data.data[1] || data.data[1] > data.max) {
      _data[1] = data.max
    } else {
      _data[1] = data.data[1]
    }

    return _data as RangeOfIntegersType;
  };

  async getNewSearchID(data: GetSearchIDDataInterface) {
    try {
      const _data = this.normalizeFilterData(data);
      return (await this.service.refreshWrapper(this.repo.getNewSearchID.bind(this.repo, _data))).data;
    } catch (e) {
      return false;
    }
  }

  async getAgregatedData(searchID: any) {
    try {
      return (await this.service.refreshWrapper(this.repo.getAgregatedData.bind(this.repo, searchID))).data;
    } catch (e) {
      return false;
    }
  }

  async findSearchIDByName(name: string) {
    try {
      return (await this.service.refreshWrapper(this.repo.findSearchIDByName.bind(this.repo, name))).data;
    } catch (e) {
      return false;
    }
  }

  async getGoodsBySearchID(searchID: string, orderType: string, pageNum = 1, onPage = 25) {
    try {
      const closure = this.repo.getGoodsBySearchID.bind(this.repo, searchID, orderType, pageNum, onPage);
      return (await this.service.refreshWrapper(closure)).data;
    } catch (e) {
      return {
        countAll: 0,
        products: [],
      }
    }
  }

  async downloadSearchResults(searchID: string, orderType: string) {
    try {
      const closure = this.repo.downloadSearchResults.bind(this.repo, searchID, orderType);
      const response = await this.service.refreshWrapper(closure);

      const headers = response.headers;
      const blob = new Blob([`\uFEFF ${response.data}`], { type: headers['content-type'] });
      FileSaver.saveAs(blob, `Moneyhunter_search.csv`);
      return true
    } catch (e) {
      return false
    }
  }

  async getSavedSearches() {
    try {
      return (await this.service.refreshWrapper(this.repo.getSavedSearches.bind(this.repo))).data;
    } catch (e) {
      return { userSavedSearched: [] };
    }
  }

  async deleteSearch(name: any) {
    try {
      return (await this.service.refreshWrapper(this.repo.deleteSearch.bind(this.repo, name))).data;
    } catch (e) {
      return { userSavedSearched: [] };
    }
  }

  async saveSearch(name: string, data: GetSearchIDDataInterface): Promise<string | true> {
    try {
      const _data = this.normalizeFilterData(data);
      AmplitudeService.blackBoxSearchSave(_data, name);

      const response = await this.service.refreshWrapper(this.repo.saveSearch.bind(this.repo, name, _data));

      return response.status === 201 || 'Произошла ошибка';
    } catch (e) {
      if (e.response?.status === 400) {
        return 'Такое имя уже используется'
      }

      return e.message;
    }
  }

  async getProductImagePathAndName(articul: string) {
    try {
      return (await this.service.refreshWrapper(this.repo.getProductImagePathAndName.bind(this.repo, articul))).data;
    } catch {
      return null;
    }
  }

  async getChartData(articul: string) {
    try {
      return (await this.service.refreshWrapper(this.repo.getChartData.bind(this.repo, articul))).data.product;
    } catch (e) {
      return null;
    }
  }

  async getCategories() {
    try {
      return (await this.service.refreshWrapper(this.repo.getCategories.bind(this.repo))).data;
    } catch (e) {
      return [];
    }
  }
}