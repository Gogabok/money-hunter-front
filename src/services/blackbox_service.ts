import {BlackboxRepository, GetSearchIDDataInterface, RangeOfIntegersType} from "@/repositories/blackbox_repository";
import { AuthService } from "@/services/auth_service";
import moment from "moment";
import FileSaver from "file-saver";
import {AmplitudeService} from "@/services/amplitude_service";

export class BlackboxService {
  private repo = new BlackboxRepository();
  private service = AuthService.getInstance();

  public normalizeFilterData(data: GetSearchIDDataInterface): GetSearchIDDataInterface {
    const _data = {} as GetSearchIDDataInterface;
    console.log(data)
    _data.feedbackRange = this.normalizeRangeData({data: data.feedbackRange, min: 0, max: 900000});
    _data.ordersRange = this.normalizeRangeData({ data: data.ordersRange, min: 0, max: 900000 });
    _data.priceRange = this.normalizeRangeData({ data: data.priceRange, min: 1, max: 900000 });
    _data.ratingRange = this.normalizeRangeData({ data: data.ratingRange, min: 0, max: 5 });
    _data.revenueRange = this.normalizeRangeData({ data: data.revenueRange, min: 0, max: 900000 });
    _data.brands = [...data.brands];
    _data.categories = [...data.categories];
    _data.addWords = [...data.addWords];
    _data.minusWords = [...data.minusWords];
    _data.days = data.days;
    _data.ids = data.ids;
    _data.providers_ids = [...data.providers_ids];
    _data.categoryOptions = data.categoryOptions ? [...data.categoryOptions] : null;

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
      return (await this.service.refreshWrapper(this.repo.getSavedSearches.bind(this.repo))).data.find((s: { data: { name: string; }; }) => s.data.name === name)['pk'];
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

  async getSavedSearchByPk(pk: number) {
    try {
      return (await this.service.refreshWrapper(this.repo.getSavedSearches.bind(this.repo))).data.find((s: { pk: number; }) => s.pk === pk);
    } catch (e) {
      return {};
    }
  }

  async deleteSearch(pk: number) {
    try {
      const response = (await this.service.refreshWrapper(this.repo.deleteSearch.bind(this.repo, pk)));
      return response.status === 204 || 'Произошла ошибка';
    } catch (e) {
      return 'Произошла ошибка';
    }
  }

  async saveSearch(name: string, data: GetSearchIDDataInterface): Promise<string | true> {
    try {
      const _data = this.normalizeFilterData(data);
      AmplitudeService.blackBoxSearchSave(_data, name);

      const pk = await this.findSearchIDByName(name);
      if(pk && !data.name) {
        data.name = name
      }
      console.log(_data, data)
      const response = await this.service.refreshWrapper(pk ?
          this.repo.updateSearch.bind(this.repo, pk, data.name, _data) : this.repo.addSearch.bind(this.repo, name, _data));
      return response.status === 201 || response.status === 200 || 'Произошла ошибка';
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

  async getChartData(articul: string, days: number) {
    try {
      return (await this.service.refreshWrapper(this.repo.getChartData.bind(this.repo, articul, days))).data.product;
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

  async getCategory(payload: any) {
    try {
      return (await this.service.refreshWrapper(this.repo.getCategory.bind(this.repo, payload))).data;
    } catch (e) {
      return [];
    }
  }

  async getProviders() {
    try {
      const cached = localStorage.getItem('providers');
      const cached_moment = moment.utc(localStorage.getItem('providers_ts'));
      const now = moment.utc();
      if (cached && cached_moment.isValid() && now.diff(cached_moment, 'hours') < 24) {
        return JSON.parse(cached);
      } else {
        const data = (await this.service.refreshWrapper(this.repo.getProviders.bind(this.repo))).data;
        localStorage.setItem('providers', JSON.stringify(data));
        localStorage.setItem('providers_ts', moment.utc().toISOString());

        return data;
      }
    } catch (e) {
      return [];
    }
  }

  async getCalculatorData(pk: number) {
    try {
      return (await this.service.refreshWrapper(this.repo.getCalculatorData.bind(this.repo, pk))).data;
    } catch (e) {
      return e.message;
    }
  }

  async getCategoriesBySearch(name: string) {
    try {
      return (await this.service.refreshWrapper(this.repo.getCategoriesBySearch.bind(this.repo, name))).data;
    } catch (e) {
      return e.message;
    }
  }
}