<template>
    <Modal title="Введите код,<br/><small>отправленный ботом в telegram</small>" closable @modalClose="modalClose">
        <div class="CodeInputModal">
            <code-input
                :default-inputs-length="4"
                @on-filled="Filled"
            />
            <img v-if="isLoading" class="CodeInputModal-loader" ondragstart="return false" src="../../assets/img/loading.svg" alt="">
            <p class="CodeInputModal-error" v-if="error">
                {{ error }}
            </p>
        </div>
    </Modal>
</template>

<script>
import Modal from "@/components/Modal";
import CodeInput from "@/shared-components/CodeInput";
import axios from "axios";
export default {
    name: "UserRegistrationViaTelegramModal",
    components: {Modal, CodeInput},
    data: () => ({
        isLoading: false,
        error: ''
    }),
    computed: {
        user() {
            return this.$store.state.user
        },
    },
    methods: {
        Filled(payload) {
            if(payload.isFilled && !this.isLoading) {
                this.isLoading = true;
                axios.post('http://45.90.34.172:8081/api/registerMeWithCode', {
                    code: payload.code,
                    userInfo: this.user
                }).then(res => {
                    this.isLoading = false;
                    this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Бот подключен, проверьте telegram', status: 'success'});
                    this.$router.push({name: 'profile'});
                }).catch(error => {
                    this.isLoading = false;
                    this.error = 'Проверочный код неверный';
                })
            }
        },
        modalClose() {
            this.$router.push('/profile')
        }
    }
}
</script>

<style lang="scss" scoped>
    .CodeInputModal {
        padding-bottom: 60px;
        &-loader {
            position: absolute;
            bottom: 0px;
            width: 120px;
            left: 50%;
            transform: translate(-50%, 0);
        }
        &-error {
            position: absolute;
            bottom: 60px;
            left: 50%;
            transform: translate(-50%, 0);
            font-size: 16px;
            color: red;
        }
    }
</style>