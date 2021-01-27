<template>
  <TreeSelect
    :error="$getValidationError(errors)"
    :value="value"
    @input="data => emitting(data)"
    ref="brandsSelector"
    label="Выберите бренд"
    :multiple="true"
    :limit="3"
    :limitText="count=>`и еще ${count}`"
    :options="[{
      id: 'all',
      name: 'Все',
      isDefaultExpanded: true,
      children: brandOptions ? brandOptions : null
    }]"
    :clear-on-select="true"
    :normalizer="brandsNormalizer"
    :dont-use-local-search="true"
    @open="handleMenuOpen"
    @close="handleMenuClose"
    @search-change="handleSearchChange"
    :loadingText="'Загрузится в течении 1 минуты'"
    v-if="!loading"
  >
    <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
      {{ node.label }}1
      <span v-if="shouldShowCount" :class="countClassName">({{ count }})2</span>
    </label>
  </TreeSelect>
</template>

<script>
  import TreeSelect from "./TreeSelect";
  import {TrackingService} from "../services/tracking_service";

  export default {
    name: "BrandsSelector",
    components: {TreeSelect},
    props: {
      errors: {
        type: Array,
        default: () => []
      },
      value: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        loadedBrands: null,
        brandOptions: null,

        brandsPortionPage: 1,
        brandsPortionSize: 30,
        brandsSearchQuery: '',
        converting: false,
        loading: false
      }
    },
    watch: {
      value: {
        handler: function () {
          if(typeof this.value[0] === 'number' && !this.converting) {
            this.value.forEach(id => {
              if(!this.brandOptions.find(item => item.id === id)) {
                this.converting = true
                this.brandOptions.push(this.loadedBrands.find(item => item.id === id))
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
    created() {
      this.loadBrands()
    },
    methods: {
      emitting(data) {
        if(data.length > 0) {
          document.querySelector(".brandsSelector .vue-treeselect__input").value = ''
        }
        this.$emit('input', data)
      },
      async loadBrands() {
        console.log('загрузил')
        const service = new TrackingService();
        this.loadedBrands = await service.getBrands();
        this.loading = true
        setTimeout(() => {
          const brands = []
          this.loadedBrands.forEach((item, index) => {
            brands.push({
              id: index,
              name: item.brand
            })
          })
          this.loadedBrands = brands
          this.brandOptions = brands.slice(0, this.brandsPortionSize);
          this.loading = false
        }, 0)
      },
      brandsNormalizer: node=>({...node, label: node.name}),
      handleMenuOpen() {
        this.$nextTick(() => {
          const menu = this.$refs.brandsSelector.getMenu();

          menu.addEventListener('scroll', () => {
            const hasReachedEnd = menu.scrollHeight - menu.scrollTop <= menu.clientHeight * 1.25;

            if (hasReachedEnd) {
              this.brandsPortionPage += 1;

              const fromIndex = (this.brandsPortionPage - 1) * this.brandsPortionSize + 1;
              const toIndex = this.brandsPortionPage * this.brandsPortionSize;

              if (this.brandsSearchQuery) {
                this.brandOptions.push(...this.handleBrandsSearch(fromIndex))
                this.$emit('brands', this.loadedBrands)
              } else {
                this.brandOptions.push(
                  ...this
                    .loadedBrands
                    .slice(fromIndex, toIndex)
                );
                this.$emit('brands', this.loadedBrands)
              }
            }
          });
        })
      },
      handleMenuClose() {
        this.$nextTick(() => {
          this.brandOptions = this.loadedBrands.slice(0, this.brandsPortionSize);
          this.brandsPortionPage = 1;
          this.$emit('brands', this.loadedBrands)
        })
      },
      handleBrandsSearch(fromIndex = 0) {
        const results = [];
        const searchQuery = this.brandsSearchQuery;
        for (let i = fromIndex; i < this.loadedBrands.length && results.length < this.brandsPortionSize; i++) {
          const loadedName = this.loadedBrands[i].name.toLowerCase();
          const _searchQuery = searchQuery.toLowerCase();
          if (loadedName.indexOf(_searchQuery) > -1 && !this.brandOptions.find(e => e.name.toLowerCase() === loadedName)) {
            results.push(this.loadedBrands[i]);
          }

          if (results.length === this.brandsPortionPage) {
            this.brandsPortionPage = parseInt(String(i / this.brandsPortionSize));
          }
        }

        return results;
      },
      handleSearchChange(searchQuery) {
        this.brandsSearchQuery = searchQuery;
        this.brandOptions = [];
        this.$nextTick(() => {
          this.brandOptions = [...this.handleBrandsSearch(), {id: 'hidden'}];
        });
      },
    }
  }
</script>

<style scoped>

</style>