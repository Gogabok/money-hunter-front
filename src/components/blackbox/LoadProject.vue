<template>
  <Modal title="Загрузить фильтр" @next="saveHandler">
    <template v-slot:default>
      <form action="" class="modal-form" @submit.prevent>
        <div class="modal-form__download-project">
          <div class="modal-form__download-project-item" v-for="(item, idx) in positions" :key="item.pk">
            <div v-if="!item.isEditMode">
              <Btn :label="item.data.name"
                 :clazz="{'button_align-left': true, 'button_empty':idx!==checked, 'button_check': idx===checked || item.contenteditable, 'button_filter': true}"
                 @click="checked=idx"
                 :pk="item.pk"/>
              <div @click="editFilter(item)" class="modal-form__download-project-item-edit"></div>
              <div @click="deleteFilter(item)" :class="idx == checked ? 'hidden' : ''" class="modal-form__download-project-item-close"></div>
            </div>
            <div v-else>
              <input :ref="`filter-input-${item.pk}`" type="text" class="filter-edit-input" v-model="item.data['newName']">
              <div @click="confirmFilterEdit(item)" class="modal-form__download-project-item-check"></div>
            </div>
          </div>
        </div>
        <div class="modal-form__double-submit modal-form__double-submit_save-project">
          <div class="modal-form__double-submit-item">
            <Btn label="Отмена" clazz="button_gray" @click="hideModal"/>
          </div>
          <div class="modal-form__double-submit-item">
            <Btn :loading="loading" label="Загрузить" :disabled="!checkedPositionName || positions.find(item => item.isEditMode)" @click="saveHandler"/>
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

    this.positions = [...searches];
  },
  methods: {
    async saveHandler() {
      if(this.checkedPositionName && !this.positions.find(item => item.isEditMode)) {
        this.loading = true

        if (this.checkedPositionName === null) {
          return;
        }

        if (this.checkedPositionName.data) {
          this.$eventBus.$emit('find_search_id_data', this.checkedPositionName);
        }
        this.loading = false

        this[HIDE_MODAL_MUTATION]();
      }
    },
    editFilter(item) {
      this.positions.map(filter => filter['isEditMode'] = false);
      this.positions.find(filter => filter.pk === item.pk)['isEditMode'] = true;
      this.positions.find(filter => filter.pk === item.pk).data['newName'] = this.positions.find(filter => filter.pk === item.pk).data.name
      this.positions = [...this.positions];
      this.$nextTick(() => {
        this.$refs[`filter-input-${item.pk}`][0].focus()
      })
    },
    async confirmFilterEdit(item) {
      const filterPreviousName = this.positions.find(filter => filter.pk === item.pk).data.name;
      if(item.data.newName.length > 0 && filterPreviousName !== item.data.newName) {

        const blackboxService = new BlackboxService();
        const _nested = {...this.positions.find(filter => filter.pk === item.pk)};
        _nested.data.name = _nested.data.newName;
        const result = await blackboxService.saveSearch(filterPreviousName, _nested.data);

        if(result) {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Группа переименована', status: 'success'})
        } else {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Произошла ошибка', status: 'error'})
        }
      } else if (item.data.newName.length <= 0){
        this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Название фильтра должно содержать хотя бы один символ', status: 'error'})
      } else if (filterPreviousName === item.data.newName) {
        this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Название фильтра осталось прежним', status: 'success'})
      }

      this.$nextTick(() => {
        this.$refs[`filter-input-${item.pk}`][0].blur();
        this.positions.map(filter => filter['isEditMode'] = false);
        this.positions = [...this.positions];
      })
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
@import "../../assets/scss/variables";

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
.filter-edit-input {
  border: 1px solid $yellow;
  height: 2.85rem;
  border-radius: 4px;
  width: 100%;
  font-weight: bold;
  color: black;
  letter-spacing: .2px;
  padding: 0 .92rem;
}
.modal-form__download-project-item-check {
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
  width: 1.71rem;
  height: 1.71rem;
  background: url("../../assets/img/ikons/check.svg") no-repeat;
}
</style>