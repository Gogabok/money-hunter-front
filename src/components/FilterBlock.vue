<template>
  <div class="filter block_container">
    <form action="" class="filter-form">
      <transition name="zoomOut" mode="out-in">
        <div v-show="filtersMode === 'byCommonFilters'" class="filter-form__columns">
          <div class="filter-form__column selectors">
            <div class="filter-form__column-item customWidthSelector">
              <TreeSelect label="Выберите категории"
                      v-if="!isCategoriesLoading"
                      v-model="categories"
                      :options="categoryOptions"
                      :normalizer="node=>({...node, label: node.name})"
                      :limit="3"
                      :limitText="count=>`и еще ${count}`"
                      :multiple="true"
                      :load-options="loadOptions"
                      @search-change="searchChange"
                      @open="handleMenuOpen"
                      ref="CategoriesTreeselect"
                      :loadingText="'Загрузится в течении 1 минуты'"
                      :dont-use-local-search="true"/>
            </div>
            <div class="filter-form__column-item">
              <ValidationProvider class="brandsSelector" :rules="{required: true}" key="byBrandType">
                <BrandsSelector
                  v-model="brands"
                  @brands="brandsFinding"
                />
              </ValidationProvider>
            </div>
          </div>
          <div class="filter-form__column column-fields-price">
            <div class="filter-form__column-item">
              <InputField label="Цена" range v-model="priceRange" :min="1" :max="900000"/>
            </div>
            <div class="filter-form__column-item">
              <FindWords label="Плюс слова" :value="addWords" v-model="addWords"></FindWords>
            </div>
          </div>
          <div class="filter-form__column column-fields-rating">
            <div class="filter-form__column-item">
              <InputField label="Рейтинг" range v-model="ratingRange" :min="0" :max="5"/>
            </div>
            <div class="filter-form__column-item">
              <FindWords label="Минус слова" v-model="minusWords"></FindWords>
            </div>
          </div>
          <div class="filter-form__column column-fields-last">
            <div class="filter-form__column-item">
              <InputField label="Отзывы" range v-model="feedbackRange" :min="0" :max="900000"/>
            </div>
            <div class="filter-form__column-item">
              <ValidationProvider class="providersSelector" :rules="{required: true}" key="byProvidersType">
                <ProvidersSelector
                  v-model="providers_ids"
                  @providers="providersFinding"
                />
              </ValidationProvider>
            </div>
          </div>
          <div class="filter-form__column column-fields-last">
            <div class="filter-form__column-item">
              <InputField :label="revenueRangeLabel" range v-model="revenueRange" :min="0" :max="9999999"/>
            </div>
            <div class="filter-form__column-item">
              <InputField :label="ordersRangeLabel" range v-model="ordersRange" :min="0" :max="900000"/>
            </div>
          </div>
        </div>
      </transition>
      <transition name="zoomOut" mode="out-in">
        <div v-show="filtersMode === 'byArticul'" class="filter-form__byArticul">
          <ValidationObserver>
            <ValidationProvider
                :rules="{required: true, is_type: 'object'}"
                :custom-messages="{is_type: 'Не найдено'}"
                v-slot="{errors}"
                key="byArticul">
                <FindProductModal 
                  @selectedIds="selectedIds"
                  :validation-error="$getValidationError(errors)"
                  v-model="currentArticulesInInput"
                />
            </ValidationProvider>
          </ValidationObserver>
        </div>
      </transition>
      <div class="filter-form__actions">
        <div class="filter-form__searchs" v-if="userSubscription==='FREE'">
          <RowWithIcon :list="[{img: searchIcon, label: 'У вас осталось поисков:'}]"/>
          <div class="filter-form__searchs-count">{{blackboxSearches}}</div>
        </div>
        <div class="filter-form__buttons">
          <Btn without-default-class
               :label="filtersMode === 'byCommonFilters' ? 'Найти по артикулам' : 'Найти по обычным фильтрам'"
               clazz="filter-form__action-button filter-form__action-button_clear"
               @click="changeFilterMode"/>
          <Btn without-default-class
               v-if="filtersMode === 'byCommonFilters'"
               label="Загрузить фильтр"
               clazz="filter-form__action-button filter-form__action-button_download"
               @click="loadProject"/>
          <Btn without-default-class
               v-if="filtersMode === 'byCommonFilters'"
               label="Сохранить фильтр"
               clazz="filter-form__action-button filter-form__action-button_save"
               @click="saveProject"/>
          <Btn without-default-class
               @click="resetFilters"
               v-if="filtersMode === 'byCommonFilters'"
               label="Очистить фильтры"
               type="reset"
               clazz="filter-form__action-button filter-form__action-button_clear"/>
          <Btn without-default-class
               label="Скачать поиск"
               :clazz="`filter-form__action-button 
               filter-form__action-button_saveSearchResult
               ${downloadBtnStatus}`"
               :loading="downloadBtnStatus === 'loading'"
               v-if="downloadBtnStatus !== 'hidden'"
               @click="downloadSearchResults"/>
        </div>
        <div class="filter-form__send">
          <Btn v-if="filtersMode === 'byCommonFilters'" :loading="isLoading" label="Найти" clazz="button_save" @click="searchBtnHandler"/>
          <Btn :disabled="selectedArticulesInInput.length <= 0" v-if="filtersMode === 'byArticul'" :loading="isLoading" label="Найти" clazz="button_save" @click="searchBtnHandlerWithArticul"/>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  import InputField from "../shared-components/InputField";
  import RowWithIcon from "../shared-components/RowWithIcon";

  import SearchImage from '../assets/img/ikons/search.svg';

  import Btn from "@/shared-components/Btn";
  import {SHOW_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import {mapMutations} from "vuex";
  import SaveProject from "@/components/blackbox/SaveProject";
  import LoadProject from "@/components/blackbox/LoadProject";
  import {CHECK_SEARCH_ID_ACTION, GET_AGREGATED_DATA} from "@/store/modules/blackbox/constants";
  import TreeSelect from "@/shared-components/TreeSelect";
  import {BlackboxService} from "../services/blackbox_service";
  import {ValidationProvider, ValidationObserver} from 'vee-validate';
  import BrandsSelector from "@/shared-components/BrandsSelector";
  import ProvidersSelector from "@/shared-components/ProvidersSelector";
  import FindWords from "@/shared-components/FindWords";
  import FindProductModal from "@/shared-components/FindProductModal";
  import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'

  export default {
    name: "FilterBlock",
    components: {BrandsSelector, ProvidersSelector, ValidationProvider, ValidationObserver, TreeSelect, Btn, InputField, RowWithIcon, FindWords, FindProductModal},
    props: {
      searchHandler: {
        type: Function,
        required: true,
      },
      isLoading: {
        type: Boolean,
        required: false
      },
      downloadBtnStatus: {
        type: [String, Boolean],
        required: false
      },
      days: {
        type: Number,
        required: true,
      },
      isHaveToSearch: {
        type: Boolean,
        required: false
      }
    },
    data() {
      return {
        searchIcon: SearchImage,
        priceRange: [],
        ordersRange: [],
        ratingRange: [],
        feedbackRange: [],
        revenueRange: [],
        categories: [0],
        brands: ['all'],

        selectedArticulesInInput: [],
        currentArticulesInInput: null,

        allCategories: null,

        addWords: [],
        minusWords: [],

        foundedBrands: null,
        foundedProviders: null,

        providers_ids: ['all'],

        isCategoriesLoading: false,
        
        categories_list: null,

        categoryOptions: [{
          id: 0,
          name: 'Все',
          isDefaultExpanded: true,
          children: null
        }],

        isCategoriesSearching: false,

        categoriesPortionPage: 1,
        categoriesPortionSize: 30,
        categoriesSearchQuery: "",

        dataLoaded: false,

        filtersMode: 'byCommonFilters'
      }
    },
    computed: {
      blackboxSearches() {
        return this.$store.state.user.subscription?.blackBoxSearches;
      },
      userSubscription() {
        return this.$store.state.user.subscription?.subscriptionType;
      },
      revenueRangeLabel() {
        switch (this.days) {
          case 7: return "Сумма заказов в неделю";
          case 14: return "Сумма заказов за две недели";
          case 30: return "Сумма заказов в месяц";
        }
        return "Сумма заказов за " + this.days + " дней";
      },
      ordersRangeLabel() {
        switch (this.days) {
          case 7: return "Заказы в неделю";
          case 14: return "Заказы за две недели";
          case 30: return "Заказы в месяц";
        }
        return "Заказы за " + this.days + " дней";
      }
    },
    beforeDestroy() {
      if(this.categories.find(item => item === 0) === 0 || this.categories.length === 0) {
        this.categories = [0]
      }
      this.$store.commit('blackbox/saveFiltersLocal', this.$data)
    },
    methods: {
      selectedIds(ids) {
        this.selectedArticulesInInput = ids.map(item => item.id)
      },
      changeFilterMode() {
        if(this.filtersMode === 'byCommonFilters') {
          this.filtersMode = 'byArticul'
        } else if(this.filtersMode === 'byArticul') {
          this.filtersMode = 'byCommonFilters'
        }
      },
      async searchBtnHandler() {
        await this.checkSearchID();
        this.searchHandler();
        this.getAgregatedData();
      }
      ,
      async searchBtnHandlerWithArticul() {
        await this.checkSearchIDWithArticul();
        this.searchHandler();
        this.getAgregatedData();
      },
      brandsFinding(brands) {
        this.foundedBrands = brands;
      }
      ,
      providersFinding(providers) {
        this.foundedProviders = providers;
      }
      ,
      searchChange(searchQuery) {
        this.categories.forEach((item, idx) => {
          if(item === 0) {
            this.categories.splice(idx, 1)
          }
        })
        this.$nextTick(() => {
          if(searchQuery.length > 0) {
            this.isCategoriesSearching = true
            this.categoriesSearchQuery = searchQuery
            const potentialItems = this.categories_list.filter(function(val) {
              return val.name.toLowerCase().match(searchQuery.toLowerCase())
            });
            this.categoryOptions = [...potentialItems.slice(0, this.categoriesPortionSize)]
          } else {
            this.isCategoriesSearching = false
            this.categoriesPortionPage = 1
            this.categoriesPortionSize = 30
            this.revertCategories()
          }
        })
      },
      handleMenuOpen() {
        this.$nextTick(() => {
          const menu = this.$refs.CategoriesTreeselect.getMenu();
          menu.addEventListener('scroll', () => {
            if(this.isCategoriesSearching) {
              const hasReachedEnd = menu.scrollHeight - menu.scrollTop <= menu.clientHeight * 1.25;
              if (hasReachedEnd) {
                this.categoriesPortionPage += 1;
                const fromIndex = (this.categoriesPortionPage - 1) * this.categoriesPortionSize + 1;
                const toIndex = this.categoriesPortionPage * this.categoriesPortionSize;
                this.loadCategoriesFromSearch(fromIndex, toIndex)
              }
            }
          })
        })
      },
      loadCategoriesFromSearch(fromIndex, toIndex) {
        const potentialItems = this.categories_list.filter((val) => {
          return val.name.toLowerCase().match(this.categoriesSearchQuery.toLowerCase())
        });
        this.categoryOptions = potentialItems.splice(0, toIndex)
      },
      getAgregatedData() {
        this.$store.dispatch(`blackbox/${GET_AGREGATED_DATA}`);
      },
      async checkSearchID() {
        const data = {...this.$data};
        delete data.searchIcon;
        delete data.availableOptions;
        delete data.brands;
        delete data.categories;
        delete data.providers_ids;
        delete data.categoryOptions;
        data.days = this.days;
        if(this.brands.length === 0) {
          this.brands = ['all']
        }
        if(this.providers_ids.length === 0) {
          this.providers_ids = ['all']
        }
        if(this.categories.length === 0) {
          this.categories = [0]
        }
      
        const categories = []
        if(this.categories.find(item => item === 0)) {
          this.categories = [0]
        }
        if(this.categories[0] !== 0) {
          this.categories.forEach(category => {
            const isIncluded = this.allCategories[0].children.find(item => item.id === category)
            if(isIncluded) {
              const childCategories = isIncluded.children_id
              if(childCategories.length > 0) {
                categories.push(...childCategories)
              }
            } else {
              categories.push(category)
            }
          })
          data.categories = categories
        } else {
          data.categories = [0]
        }
        
        let brands = [...this.brands];
        if (brands[0] !== 'all') {
          brands = []
          this.brands.forEach(id => {
            brands.push(this.foundedBrands.find(item => item.id === id).name)
          })
        }
        data.brands = brands
        let providers = [...this.providers_ids];
        if (providers[0] !== 'all') {
          providers = []
          this.providers_ids.forEach(id => {
            providers.push(this.foundedProviders.find(item => item.id === id).id)
          })
        } else if (providers[0] === 'all') {
          providers = []
        }
        data.providers_ids = providers
        await this.$store.dispatch(`blackbox/${CHECK_SEARCH_ID_ACTION}`, data);
      }
      ,
      async checkSearchIDWithArticul() {
        const data = {...this.$data};
        delete data.searchIcon;
        delete data.availableOptions;
        delete data.brands;
        delete data.categories;
        delete data.providers_ids;
        delete data.categoryOptions;
        data.days = this.days;
        data.ids = this.selectedArticulesInInput;
        if(this.brands.length === 0) {
          this.brands = ['all']
        }
        if(this.providers_ids.length === 0) {
          this.providers_ids = ['all']
        }
        if(this.categories.length === 0) {
          this.categories = [0]
        }
      
        const categories = [];
        if(this.categories.find(item => item === 0)) {
          this.categories = [0]
        } 
        
        data.categories = this.categories;
        let brands = [...this.brands];
        if (brands[0] !== 'all') {
          brands = []
          this.brands.forEach(id => {
            brands.push(this.foundedBrands.find(item => item.id === id).id)
          })
        }
        data.brands = brands
        let providers = [...this.providers_ids];
        if (providers[0] !== 'all') {
          providers = []
          this.providers_ids.forEach(id => {
            providers.push(this.foundedProviders.find(item => item.id === id).name)
          })
        } else if (providers[0] === 'all') {
          providers = []
        }
        data.providers_ids = providers
        await this.$store.dispatch(`blackbox/${CHECK_SEARCH_ID_ACTION}`, data);
      }
      ,
      resetFilters() {
        this.priceRange = [];
        this.ordersRange = [];
        this.ratingRange = [];
        this.feedbackRange = [];
        this.revenueRange = [];
        this.categories = [0];
        this.brands = ['all'];
        this.addWords = [];
        this.minusWords = [];
        this.providers_ids = ['all']
      }
      ,
      loadProject() {
        this[SHOW_MODAL_MUTATION]({component: LoadProject});
        this.$eventBus.$once('find_search_id_data', ({data}) => {
          if(data.priceRange[0] <= 1) {
            data.priceRange[0] = ''
          } 
          if(data.priceRange[1] >= 900000) {
            data.priceRange[1] = ''
          } 
          this.priceRange = data.priceRange;
          if(data.ordersRange[0] <= 0) {
            data.ordersRange[0] = ''
          } 
          if(data.ordersRange[1] >= 900000) {
            data.ordersRange[1] = ''
          } 
          this.ordersRange = data.ordersRange;
          if(data.ratingRange[0] <= 0) {
            data.ratingRange[0] = ''
          } 
          if(data.ratingRange[1] >= 5) {
            data.ratingRange[1] = ''
          } 
          this.ratingRange = data.ratingRange;
          if(data.feedbackRange[0] <= 0) {
            data.feedbackRange[0] = ''
          } 
          if(data.feedbackRange[1] >= 900000) {
            data.feedbackRange[1] = ''
          } 
          this.feedbackRange = data.feedbackRange;
          if(data.revenueRange[0] <= 0) {
            data.revenueRange[0] = ''
          } 
          if(data.revenueRange[1] >= 9999999) {
            data.revenueRange[1] = ''
          } 
          this.revenueRange = data.revenueRange;
          let brands = [];
          if (data.brands[0] !== 'all') {
            data.brands.forEach(name => {
              brands.push(this.foundedBrands.find(item => item.name === name).id)
            })
          } else {
            brands = ['all']
          }
          let providers = [];
          if (data.providers_ids[0] !== 'all') {
            data.providers_ids.forEach(id => {
              providers.push(this.foundedProviders.find(item => item.id === id).id)
            })
          } else {
            providers = ['all']
          }
          if(data.categories[0] !== 0) {
            this.categoryOptions = [{
              id: 0,
              name: 'Все',
              isDefaultExpanded: true,
              children: this.allCategories[0].children
            }]
          }
          if(this.categoryOptions[0].children) {
            this.categoryOptions = data.categoryOptions
          }
          this.categories = data.categories;
          data.brands = brands;
          this.brands = data.brands;
          data.providers = providers;
          this.providers_ids = data.providers_ids;
          this.addWords = data.addWords;
          this.minusWords = data.minusWords;
          this.searchBtnHandler();
        })
      }
      ,
      saveProject() {
        const _data = {...this.$data}
        delete _data.brands
        let brands = [...this.brands];
        if (this.brands[0] !== 'all') {
          brands = []
          this.brands.forEach(id => {
            brands.push(this.foundedBrands.find(item => item.id === id).name)
          })
        }
        _data["brands"] = brands
        _data['days'] = this.days
        let providers = [...this.providers_ids];
        if (this.providers_ids[0] !== 'all') {
          providers = []
          this.providers_ids.forEach(id => {
            providers.push(this.foundedProviders.find(item => item.id === id).name)
          })
        }
        _data["providers"] = providers
        this[SHOW_MODAL_MUTATION]({component: SaveProject, data: _data});
      },
      compareTime(dateString, now) {
        const differentTime = 86400000
        if(dateString + differentTime <= now) {
          return true
        } else {
          return false
        }
      }
      ,
      async loadCategories() {
        let categories = null
        const cachedCategories = JSON.parse(localStorage.getItem("categories"))
        if(cachedCategories) {
          categories = cachedCategories

          this.isCategoriesLoading = true
          this.$nextTick(() => {
            this.isCategoriesLoading = false
            const timestamp = cachedCategories.timestamp
            const timeNow = new Date().getTime()
            if(this.compareTime(Number.parseInt(timestamp), timeNow)) {
              this.loadUpdatedCategories()
            }
          })
        } else {
          categories = await this.loadUpdatedCategories()
          localStorage.setItem('isCategoriesUpdated', true)
        }
        this.categories = [0]
        this.allCategories = categories.categories
        this.categories_list = categories.categories_list
        
        const isCategoriesUpdated = JSON.parse(localStorage.getItem('isCategoriesUpdated'))
        
        if(!isCategoriesUpdated || !categories?.categories || !categories?.categories_list) {
          this.isCategoriesLoading = true
          await this.loadUpdatedCategories()
          this.$nextTick(() => {
            this.isCategoriesLoading = false
            localStorage.setItem('isCategoriesUpdated', true)
            
            this.categories = [0]
            this.allCategories = categories.categories
            this.categories_list = categories.categories_list
          })
        }
      }
      ,
      async loadUpdatedCategories () {
        const service = new BlackboxService();

        const loadedCategories = await service.getCategories()

        this.allCategories = loadedCategories.categories
        this.categories_list = loadedCategories.categories_list

        localStorage.setItem("categories", JSON.stringify({categories: loadedCategories.categories, categories_list: loadedCategories.categories_list, timestamp: new Date().getTime().toString()}))
        
        this.isCategoriesLoading = true
        this.$nextTick(() => {
          this.isCategoriesLoading = false
        })
        return loadedCategories
      }
      ,
      loadOptions({ action, parentNode, callback }) {
        if(parentNode.id !== 0) {
          if (action === LOAD_CHILDREN_OPTIONS) {
            if(parentNode.children_id.length > 0) {
              const parentChildrens = this.allCategories[0].children.find(item => item.id === parentNode.id).children
              parentNode.children = parentChildrens ? parentChildrens : false
              callback()
            }
          }
        }
      },
      downloadSearchResults() {
        this.$emit('downloadSearchResults')
      }
      ,
      revertCategories() {
        if(!this.dataLoaded) {
          if(this.allCategories) {
            const categories = this.allCategories
            const newCats = []
            categories[0].children.forEach(item => {
              const cat = {
                children_id: item.children_id,
                id: item.id,
                name: item.name
              }
              if(item.children_id.length > 0) {
                cat['children'] = null
              }
              newCats.push(cat)
            })
            this.categoryOptions = [{
              id: 0,
              name: "Все",
              isDefaultExpanded: true,
              children: newCats
            }]
          } else this.categoryOptions = [{
            id: 0,
            name: 'Все',
            isDefaultExpanded: true,
            children: null
          }]
        }
      },
      ...
        mapMutations('modal', [SHOW_MODAL_MUTATION])
    },
    created() {
      const myLocalFilters = this.$store.getters['blackbox/myLocalFilters'];
      if(myLocalFilters) {
        this.brands = []
        this.providers_ids = []
        this.dataLoaded = true
        this.allCategories = []
        this.$nextTick(() => {

          Object.keys(this.$data).forEach(key => {
            this.$data[key] = myLocalFilters[key]
          })

          if(this.categories.find(item => item === 0) !== 0) {
            this.$nextTick(() => {
              this.categoryOptions[0].children = this.allCategories[0].children
            })
          }

        })
      } else {
        this.loadCategories();
      }
    },
    watch: {
      allCategories: {
        handler: function () {
          this.revertCategories()
          // if(this.allCategories) {
          //   this.isCategoriesLoading = false
          // }
        },
        deep: true
      },
      categories: {
        handler: function () {
          if(document.querySelector(".customWidthSelector .vue-treeselect__input") && document.querySelector(".customWidthSelector .vue-treeselect__input").value.length > 0) {
            document.querySelector(".customWidthSelector .vue-treeselect__input").value = ''
          }
        },
        deep: true
      },
      isHaveToSearch: {
        handler: function () {
          if(this.filtersMode === 'byCommonFilters') {
            this.searchBtnHandler()
          } else if(
            this.selectedArticulesInInput.length >= 0
            && this.filtersMode === 'byArticul') {
              this.searchBtnHandlerWithArticul()
            }
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";

  .filter-form__action-button {
    border: 1px solid $drayDevider;
    border-radius: 4px;
    // color: $titleColor;
    color: #000;
    padding-left: 2.28rem;
    padding-right: 1rem;
    height: 2.57rem;
    // background: #808080 !important;

    &:not(:last-child) {
      margin-right: 1.07rem;
    }

    &.filter-form__action-button_download {
      background: url("../assets/img/ikons/download2.svg") no-repeat .92rem center, white;
    }

    &.filter-form__action-button_save {
      background: url("../assets/img/ikons/save.svg") no-repeat .85rem center, white;
    }

    &.filter-form__action-button_clear {
      background: url("../assets/img/ikons/clear.svg") no-repeat .78rem center, white;
    }

    &.filter-form__action-button_saveSearchResult {
      width: 140px;
      background: url("../assets/img/ikons/save.svg") no-repeat .85rem center, white;
      &.loading {
        background: #fff;
        padding-left: 0px;
        padding-right: 0px;
        cursor: default;
      }
    }
  }

  .filter {
    margin: 1.42rem 2.28rem 0;
    padding: 1.71rem 1.42rem 2.28rem;
    border-radius: 8px;
    background: white;
    border: 1px solid $drayDevider;
    position: relative;
    &-form__columns {
      display: flex;
      & .filter-form__column {
        display: flex;
        flex-direction: column;
        margin: 0px 10px;
        min-width: 150px;
        width: 100%;
        &-item {
          margin: 10px 0px;
        }
        &.selectors {
          max-width: 250px;
        }
        &.column-fields-custom {
          flex-direction: row;
          min-width: 250px;
          width: 100%;
          & .filter-form__column-item {
            margin: 10px 0px;
            width: 100%;
            &:nth-child(1) {
              margin-right: 10px;
            }
            &:nth-child(2) {
              margin-left: 10px;
            }
          }
        }
      }
    }
  }

  .filter-form__column-item {
    & .disabled {
      position: relative;
      &::before {
        position: absolute;
        bottom: -3px;
        padding: 5px 10px;
        background: rgba(0, 0, 0, .8);
        display: block;
        color: #fff;
        z-index: 78;
        left: 50%;
        transform: translate(-50%, 100%);
        border-radius: 4px;
        content: "Не доступно на вашем тарифе";
        width: 250px;
        text-align: center;
        opacity: 0;
        transition-duration: .2s;
      }
    }
    & .disabled:hover {
      &::before {
        opacity: 1;
      }
    }
  }

  @media screen and (max-width: 1300px) {
    .filter {
      &-form__columns {
        display: flex;
        & .filter-form__column {
          display: flex;
          flex-direction: column;
          margin: 0px 10px;
          min-width: 150px;
          width: 100%;
          &-item {
            margin: 10px 0px;
          }
          &.selectors {
            max-width: 250px;
          }
          &.column-fields-custom {
            flex-direction: column;
            min-width: 150px;
            width: 100%;
            & .filter-form__column-item {
              margin: 10px 0px;
              width: 100%;
              &:nth-child(1) {
                margin-right: 0px;
              }
              &:nth-child(2) {
                margin-left: 0px;
              }
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 1050px) {
    .filter {
      &-form__columns {
        display: flex;
        flex-wrap: wrap;
        & .filter-form__column {
          display: flex;
          flex-direction: column;
          margin: 0px 10px;
          min-width: 150px;
          width: calc((100% / 3) - 20px);
          &-item {
            margin: 10px 0px;
          }
          &.selectors {
            max-width: 250px;
          }
          &.column-fields-last {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            width: calc(100% - 20px);
            max-width: 100%;
            margin: 0px;
            & .filter-form__column-item {
              width: calc(50% - 20px);
              margin: 10px 10px;
            }
          }
          &.column-fields-custom {
            flex-direction: row;
            min-width: 150px;
            // width: calc((100% / 1.5) - 20px);
            width: calc((100% / 3) - 20px);
            & .filter-form__column-item {
              margin: 10px 0px;
              width: 100%;
              &:nth-child(1) {
                margin-right: 0px;
              }
              &:nth-child(2) {
                margin-left: 0px;
              }
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    .filter {
      &-form__columns {
        display: flex;
        flex-wrap: wrap;
        & .filter-form__column {
          display: flex;
          flex-direction: column;
          margin: 0px 10px;
          min-width: 150px;
          width: calc((100% / 2) - 20px);
          &-item {
            margin: 10px 0px;
          }
          &.selectors {
            max-width: 100%;
            width: 100%;
          }
          &.column-fields-last {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            max-width: 100%;
            margin: 0px;
            & .filter-form__column-item {
              width: calc((100% / 2) - 20px);
              margin: 10px 10px;
            }
          }
          &.column-fields-custom {
            flex-direction: row;
            min-width: 150px;
            width: 100%;
            & .filter-form__column-item {
              width: 100%;
              margin: 10px 0px;
              width: 100%;
              &:nth-child(1) {
                margin-right: 10px;
              }
              &:nth-child(2) {
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 550px) {
    .filter {
      padding: 5px 10px;
      margin-top: 20px !important;
      &-form__columns {
        display: flex;
        flex-wrap: wrap;
        & .filter-form__column {
          display: flex;
          flex-direction: column;
          margin: 0px 0px !important;
          min-width: 150px;
          width: 100%;
          &-item {
            margin: 10px 0px;
          }
          &.selectors {
            max-width: 100%;
            width: 100%;
            order: 1;
          }
          &.column-fields-rating {
            order: 3;
            .filter-form__column-item:nth-child(1) {
              order: 2;
            }
            .filter-form__column-item:nth-child(2) {
              order: 1;
            }
          }
          &.column-fields-price {
            order: 2;
          }
          &.column-fields-last {
            order: 5;
          }
          &.column-fields-last {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 100%;
            margin: 0px;
            & .filter-form__column-item {
              width: 100%;
              margin: 10px 0px;
            }
          }
          &.column-fields-custom {
            flex-direction: column;
            min-width: 100%;
            width: 100%;
            order: 4;
            & .filter-form__column-item {
              width: 100%;
              margin: 10px 0px !important;
              width: 100%;
            }
          }
        }
      }
    }
  }

  // .filter-form__fields {
  //   display: flex;
  //   justify-content: space-between;
  // }

  // .filter-form__item {

  //   &:first-child {
  //     max-width: 240px;
  //     min-width: 240px;
  //   }
  //   & .vue-treeselect__list {
  //     // width: 300px !important;
  //     // max-width: 300px !important;
  //     // min-width: 300px !important;
  //   }

  //   &:not(:last-child) {
  //     margin-right: 1.42rem;
  //   }

  //   &-brands {
  //     // max-width: 180px;
  //     & .brandsSelector {
  //       display: block;
  //       margin: 10px 0px;
  //     }
  //   }
  // }

  .filter-form__actions {
    margin-top: 1.42rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .filter-form__send {
    width: 10rem;
    margin-left: 1.07rem;
  }

  .filter-form__buttons {
    display: flex;
    align-items: center;
  }

  .filter-form__searchs {
    display: flex;
    align-items: center;
    margin-right: 3.85rem;

    .item-row {
      margin-right: .71rem;
    }
  }

  .filter-form__searchs-count {
    font-weight: bold;
  }
   @media screen and (max-width: 1300px) {
    .filter-form__fields {
      flex-wrap: wrap;
    }
    .filter-form__item {
      max-width: 150px !important;
      width: 100% !important;
      margin: 10px 5px !important;
      overflow: visible !important;
      & * {
        overflow: visible !important;
      }
      &-brands {
        // max-width: 250px !important;
        margin: 10px 5px !important;
        width: 100% !important;
      }
    }
    .filter-form__item .input-field {
      display: block;
    }
  }
  @media screen and (max-width: 710px) {
    .filter-form__fields {
      justify-content: center;
    }
    .filter {
      margin: 10px;
    }
  }
  @media screen and (max-width: 900px) {
    .filter-form__actions {
      flex-wrap: wrap;
      & button {
        margin: 5px 10px !important;
        width: 170px;
      }
    }
    .filter-form__buttons {
      flex-wrap: wrap;
      justify-content: center;
      margin: 0px auto;
    }
    .block_container {
      padding-bottom: 10px;
    }
    .filter-form__send {
      margin: 10px auto;
      width: auto;
      & .button_save {
        width: 170px;
      }
    }
  }

  .zoomOut-enter-active, .zoomOut-leave-active {
    transition: transform .2s;
  }
  .zoomOut-enter, .zoomOut-leave-to {
    transform: scale(0);
    position: absolute;
    left: 0;
    top: 0;
  }
</style>