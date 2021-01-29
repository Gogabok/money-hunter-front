<template>
  <TreeSelect
    :error="$getValidationError(errors)"
    :value="value"
    @input="data => emitting(data)"
    ref="providersSelector"
    label="Выберите продавца"
    :multiple="true"
    :limit="3"
    :limitText="count=>`и еще ${count}`"
    :load-options="loadProviders"
    :options="[{
      id: 'all',
      name: 'Все',
      isDefaultExpanded: true,
      children: providerOptions
    }]"
    :clear-on-select="true"
    :normalizer="providersNormalizer"
    :dont-use-local-search="true"
    @open="handleMenuOpen"
    @close="handleMenuClose"
    @search-change="handleSearchChange"
    :loadingText="'Загрузится в течении 1 минуты'"
    :disabled="userSubscription !== 'BUSINESS'"
    :class="userSubscription !== 'BUSINESS' ? 'disabled' : ''"
    :helper="helper"
    :noChildrenText="'Нет доступных поставщиков'"
  >
    <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
      {{ node.label }}1
      <span v-if="shouldShowCount" :class="countClassName">({{ count }})2</span>
    </label>
  </TreeSelect>
</template>

<script>
  import TreeSelect from "./TreeSelect";
  import { BlackboxService } from '@/services/blackbox_service';

  export default {
    name: "ProvidersSelector",
    components: {TreeSelect},
    props: {
      errors: {
        type: Array,
        default: () => []
      },
      value: {
        type: Array,
        required: true
      },
      helper: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        loadedProviders: null,
        providerOptions: null,

        providersPortionPage: 1,
        providersPortionSize: 30,
        providersSearchQuery: '',
        converting: false
      }
    },
    computed: {
      userSubscription() {
        return this.$store.state.user.subscription?.subscriptionType;
      },
    },
    watch: {
      value: {
        handler: function () {
          if(typeof this.value[0] === 'number' && !this.converting && this.loadedProviders) {
            this.value.forEach(id => {
              if(!this.providerOptions.find(item => item.id === id)) {
                this.converting = true
                this.providerOptions.push(this.loadedProviders.find(item => item.id === id))
                this.$nextTick(() => {
                  this.converting = false
                })
              }
            })
          }
        },  
        deep: true
      }
    },
    methods: {
      emitting(data) {
        if(data.length > 0) {
          document.querySelector(".providersSelector .vue-treeselect__input").value = ''
        }
        this.$emit('input', data)
      },
      async loadProviders() {
        const service = new BlackboxService();
        this.loadedProviders = await service.getProviders();
        const providers = [...this.loadedProviders];

        this.loadedProviders = providers;
        
        this.$emit('providers', this.loadedProviders)
        this.providerOptions = providers.slice(0, this.providersPortionSize);
      },
      providersNormalizer: node=>({...node, label: node.name}),
      handleMenuOpen() {
        this.$nextTick(() => {
          const menu = this.$refs.providersSelector.getMenu();

          menu.addEventListener('scroll', () => {
            const hasReachedEnd = menu.scrollHeight - menu.scrollTop <= menu.clientHeight * 1.25;

            if (hasReachedEnd) {
              this.providersPortionPage += 1;

              const fromIndex = (this.providersPortionPage - 1) * this.providersPortionSize + 1;
              const toIndex = this.providersPortionPage * this.providersPortionSize;

              if (this.providersSearchQuery) {
                this.providerOptions.push(...this.handleProvidersSearch(fromIndex))
                this.$emit('providers', this.loadedProviders)
              } else {
                this.providerOptions.push(
                  ...this
                    .loadedProviders
                    .slice(fromIndex, toIndex)
                );
                this.$emit('providers', this.loadedProviders)
              }
            }
          });
        })
      },
      handleMenuClose() {
        this.$nextTick(() => {
          this.providerOptions = this.loadedProviders.slice(0, this.providersPortionSize);
          this.providersPortionPage = 1;
          this.$emit('providers', this.loadedProviders)
        })
      },
      handleProvidersSearch(fromIndex = 0) {
        const results = [];
        const searchQuery = this.providersSearchQuery;
        for (let i = fromIndex; i < this.loadedProviders.length && results.length < this.providersPortionSize; i++) {
          const loadedName = this.loadedProviders[i].name.toLowerCase();
          const _searchQuery = searchQuery.toLowerCase();
          if (loadedName.indexOf(_searchQuery) > -1 && !this.providerOptions.find(e => e.name.toLowerCase() === loadedName)) {
            results.push(this.loadedProviders[i]);
          }

          if (results.length === this.providersPortionPage) {
            this.providersPortionPage = parseInt(String(i / this.providersPortionSize));
          }
        }

        return results;
      },
      handleSearchChange(searchQuery) {
        this.providersSearchQuery = searchQuery;
        this.providerOptions = [];
        this.$nextTick(() => {
          this.providerOptions = [...this.handleProvidersSearch(), {id: 'hidden'}];
        });
      },
    }
  }
</script>
