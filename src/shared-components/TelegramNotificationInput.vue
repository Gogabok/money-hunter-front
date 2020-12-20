<template>
    <div class="TelegramNotificationInput">
        <span class="TelegramNotificationInput-title">
            {{ !isRegistered 
               ? 'Подключить уведомления в Telegram'
               : 'Уведомления через Telegram подключены' }}
        </span>
        <Btn
            @click="FindMeWithTelegram"
            :label="!isRegistered ? 'Подключить уведомления' : 'Уведомления подключены'"
            :disabled="isRegistered"
        />
    </div>
</template>

<script>
import Btn from "@/shared-components/Btn"
import UserRegistrationViaTelegramModal from "@/components/telegram-notifications/UserRegistrationViaTelegramModal.vue";
import axios from "axios";
export default {
    name: "TelegramNotificationInput",
    components: {Btn},
    data: () => ({
        isRegistered: false,
    }),
    methods: {
        FindMeWithTelegram() {
            window.open('https://t.me/MoneyHunterNotificationsBot');
            setTimeout(() => {
                this.$router.push(`profile/notificationsViaTelegram`);
            }, 1);
        }
    },
    computed: {
        user() {
            return this.$store.state.user
        },
    },
    created() {
        if(!localStorage.getItem('isRegisteredViaTelegram')) {
            axios.get(`http://45.90.34.172:8081/api/isUserRegistered?email=${this.user.data.email}`).then(isRegistered => {
                this.isRegistered = isRegistered
                localStorage.setItem('isRegisteredViaTelegram', true)
            }).catch(erorr => {
                this.isRegistered = false
            })
        } else {
            this.isRegistered = true
        }
    },
}
</script>

<style lang="scss" scoped>
    .TelegramNotificationInput {
        &-title {
            letter-spacing: .2px;
            color: #9FA2B4;
            font-weight: bold;
            display: block;
            margin-bottom: 3px;
        }
    }
</style>