<template>
  <Modal title="Загрузить фильтр" @next="saveHandler">
    <template v-slot:default>
      <form action="" class="modal-form" @submit.prevent>
        <div class="modal-form__download-project">
          <div class="modal-form__download-project-item" v-for="(item, idx) in positions" :key="idx">
            <Btn :label="item.name"
                 :clazz="{'button_align-left': true, 'button_empty':idx!==checked, 'button_check': idx===checked}"
                 @click="checked=idx"/>
            <div @click="deleteFilter(item)" :class="idx == checked ? 'hidden' : ''" class="modal-form__download-project-item-close"></div>
          </div>
        </div>
        <div class="modal-form__double-submit modal-form__double-submit_save-project">
          <div class="modal-form__double-submit-item">
            <Btn label="Отмена" clazz="button_gray" @click="hideModal"/>
          </div>
          <div class="modal-form__double-submit-item">
            <Btn :loading="loading" label="Загрузить" @click="saveHandler"/>
          </div>
        </div>
      </form>
    </template>
  </Modal>
</template>

<script>
  import Modal from "../Modal";
  import {mapActions, mapMutations} from "vuex";
  import {HIDE_MODAL_MUTATION} from "../../store/modules/modal/constants";
  import Btn from "../../shared-components/Btn";
  import {BlackboxService} from "@/services/blackbox_service";
  import {FIND_SEARCH_ID_BY_NAME_ACTION} from "../../store/modules/blackbox/constants";


  export default {
    name: "LoadProject",
    components: {Btn, Modal},
    data() {
      return {
        checked: null,
        positions: [],

        loading: false
      }
    },
    computed: {
      checkedPositionName() {
        return this.checked === null ? null : this.positions[this.checked];
      }
    },
    async created() {
      const blackboxService = new BlackboxService();
      const searches = await blackboxService.getSavedSearches();

      this.positions = [...searches.userSavedSearches];
    },
    methods: {
      async saveHandler() {
        this.loading = true
        
        if (this.checkedPositionName === null) {
          return;
        }

        const searchResult = await this[FIND_SEARCH_ID_BY_NAME_ACTION](this.checkedPositionName.pk);
        if (searchResult) {
          this.$eventBus.$emit('find_search_id_data', searchResult);
        }

        this.loading = false

        this[HIDE_MODAL_MUTATION]();
      },
      async deleteFilter(item) {
        const blackboxService = new BlackboxService();
        const result = await blackboxService.deleteSearch(item.name);
        if(result.details === `search ${item.name} deleted`) {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: `Группа ${item.name} удалена`, status: 'success'})

          const searches = await blackboxService.getSavedSearches();
          this.positions = [...searches.userSavedSearches];
          
        } else {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: `Произошла ошибка. Группа ${item.name} не была удалена`, status: 'error'})
        }
      },
      ...mapMutations('modal', [HIDE_MODAL_MUTATION]),
      ...mapActions('blackbox', [FIND_SEARCH_ID_BY_NAME_ACTION])
    }
  }
</script>

<style scoped lang="scss">
  .modal-form__download-project-item {
    position: relative;
  }
  .modal-form__download-project-item-close {
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translate(0, -50%);
    width: 1.71rem;
    height: 1.71rem;
    background: url("../../assets/img/ikons/close.svg") no-repeat;
    &.hidden {
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
    }
  }
</style>