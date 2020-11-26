import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import Auth from '../views/Auth.vue';
import Profile from '../views/Profile.vue';
import Tracking from '../views/Tracking.vue';

import Login from '../components/auth/Login.vue';
import Register from '../components/auth/Register.vue';
import RecoverRequest from '../components/auth/RecoverRequest.vue';
import RecoverConfirm from '../components/auth/RecoverConfirm.vue';

import GroupList from '../components/tracking/GroupList.vue';


import {TokenService} from "@/services/token_service";
import {lazyLoad} from "@/helpers";
import {AmplitudeService} from "@/services/amplitude_service";
import store from "@/store";
import {GET_PROFILE_ACTION} from "@/store/modules/user/constants";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'root',
    redirect: () => {
      const tokenService = new TokenService();

      return tokenService.isLoggedIn() ? '/blackbox' : '/auth/login'
    }
  },
  {
    path: '/blackbox',
    name: 'blackbox',
    component: lazyLoad('views/Blackbox'),
    meta: {
      title: 'Поиск товаров'
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {
      title: 'Профиль'
    }
  },
  {
    path: '/tracking',
    name: 'tracking',
    component: Tracking,
    redirect: {name: 'tracking.group_list'},
    meta: {
      title: 'Отслеживание',
    },
    children: [
      {path: 'groups', name: 'tracking.group_list', component: GroupList},
      {path: 'group/:name', name: 'tracking.group', component: lazyLoad('components/tracking/Group')}
    ]
  },
  {
    path: "/reset/:uidb64/:token",
    name: 'auth.reset_password_redirection',
    redirect: to => ({name: 'auth.recover_confirm', params: to.params})
  },
  {
    path: "/auth",
    name: 'auth',
    component: Auth,
    beforeEnter(to, from, next) {
      const tokenService = new TokenService();
      if (tokenService.isLoggedIn()) {
        next({name: 'profile'});
      } else {
        next();
      }
    },
    children: [
      {path: 'login', name: 'auth.login', component: Login, meta: {title: 'Войти'}},
      {path: 'register', name: 'auth.register', component: Register, meta: {title: 'Регистрация'}},
      {
        path: 'recover_request',
        name: 'auth.recover_request',
        component: RecoverRequest,
        meta: {title: 'Восстановление пароля'}
      },
      {
        path: 'recover_confirm/:uidb64/:token',
        name: 'auth.recover_confirm',
        component: RecoverConfirm,
        meta: {title: 'Восстановление пароля'}
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  const tokenService = new TokenService();
  if (!to.name?.startsWith('auth.') && !tokenService.isLoggedIn()) {
    next({name: 'auth.login'})
  } else {
    if (!to.name?.startsWith('auth.')) {
      if(!store.getters[`user/getEmail`]){
        await store.dispatch(`user/${GET_PROFILE_ACTION}`);
        AmplitudeService.pageLoad(String(to.name));
      }
    }

    next();
  }
});

export default router;
