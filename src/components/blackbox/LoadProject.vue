<template>
  <Modal title="Загрузить фильтр" @next="saveHandler">
    <template v-slot:default>
      <form action="" class="modal-form" @submit.prevent>
        <div class="modal-form__download-project">
          <div class="modal-form__download-project-item" v-for="(item, idx) in positions" :key="item.pk">
            <Btn :label="item.data.name"
                 :clazz="{'button_align-left': true, 'button_empty':idx!==checked, 'button_check': idx===checked || item.contenteditable, 'button_filter': true}"
                 @click="checked=idx"
                 :contenteditable="item.contenteditable"
                 :ref="`filter-${item.pk}`"
                 :pk="item.pk"
                 @onInput="editFilterName"/>
            <div v-if="!item.contenteditable" @click="editFilter(item)" class="modal-form__download-project-item-edit"></div>
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
      contenteditable: false,
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

    this.positions = [...searches];
  },
  methods: {
    async saveHandler() {
      this.loading = true

      if (this.checkedPositionName === null) {
        return;
      }

      if (this.checkedPositionName.data) {
        this.$eventBus.$emit('find_search_id_data', this.checkedPositionName);
      }
      this.loading = false

      this[HIDE_MODAL_MUTATION]();
    },
    editFilter(item) {
      this.positions.map(filter => filter['contenteditable'] = false)
      this.positions.find(filter => filter.pk === item.pk)['contenteditable'] = true
      this.positions = [...this.positions]
      this.$nextTick(() => {
        const range = document.createRange();
        range.selectNodeContents(this.$refs[`filter-${item.pk}`][0].$el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      })
    },
    async editFilterName(e) {
      const filterPreviousName = this.positions.find(item => item.pk === e.pk).data.name;
      if(e.e.target.innerText.length > 0 && filterPreviousName !== e.e.target.innerText) {
        const blackboxService = new BlackboxService();

        const _nested = {...this.positions.find(item => item.pk === e.pk)};
        _nested.data.name = e.e.target.innerText;
        const result = await blackboxService.saveSearch(filterPreviousName, _nested.data);

        if(result) {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Группа переименована', status: 'success'})
        } else {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Произошла ошибка', status: 'error'})
        }

        this.positions.find(item => item.pk === e.pk).data.name = e.e.target.innerText;

        this.$nextTick(() => {
          this.$refs[`filter-${e.pk}`][0].$el.blur();
          this.positions.map(filter => filter['contenteditable'] = false);
          this.positions = [...this.positions];
        })
      } else {
        this.$refs[`filter-${e.pk}`][0].$el.blur();
        this.positions.map(filter => filter['contenteditable'] = false);
        this.$refs[`filter-${e.pk}`][0].$el.innerHTML = filterPreviousName
        this.positions.find(item => item.pk === e.pk).data.name = filterPreviousName;
        this.positions = [...this.positions];
      }
    },
    async deleteFilter(item) {
      const blackboxService = new BlackboxService();
      const result = await blackboxService.deleteSearch(item.pk);
      if(result) {
        this.$store.commit('notifications/ADD_NOTIFICATION', {text: `Группа ${item.data.name} удалена`, status: 'success'})

        const searches = await blackboxService.getSavedSearches();
        this.positions = [...searches];

      } else {
        this.$store.commit('notifications/ADD_NOTIFICATION', {text: `Произошла ошибка. Группа ${item.data.name} не была удалена`, status: 'error'})
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
.modal-form__download-project-item-edit {
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 35px;
  transform: translate(0, -50%);
  width: 2rem;
  height: 2rem;
  background: url("../../assets/img/ikons/edit.svg") no-repeat;
  background-position: center center;
}
</style>