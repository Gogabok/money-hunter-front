import {
  CLEAR_USER_MUTATION,
  GET_PROFILE_ACTION, GET_SUBSCRIPTION_ACTION,
  LOGOUT_ACTION, POST_USER_ACTION, SET_SUBSCRIPTION_MUTATION,
  SET_USER_MUTATION,
  GET_PAYMENT_LINK_ACTION,
  GET_ALL_SUBSCRIBTIONS,
  POST_CANCEL_SUBSCRIPTION
} from "@/store/modules/user/constants";
import {ActionContext} from "vuex";
import {UserService} from "@/services/user_service";
import router from "@/router";
import {AuthService} from "@/services/auth_service";
import {VuexUserStateDataInterface, VuexUserStateInterface} from "@/store/modules/user/index";
import {AmplitudeService} from "@/services/amplitude_service";

export default {
  async [GET_PROFILE_ACTION](context: ActionContext<any, any>) {
    const userService = new UserService();
    const response = await userService.getProfile();

    await context.commit(SET_USER_MUTATION, response);
  },
  async [LOGOUT_ACTION](context: ActionContext<VuexUserStateInterface, any>) {
    const authService = AuthService.getInstance();
    await authService.logout();

    context.commit(CLEAR_USER_MUTATION);
    await router.push({name: 'auth.login'})
  },
  async [POST_USER_ACTION](context: ActionContext<VuexUserStateInterface, any>) {
    const userService = new UserService();

    const data = {...context.state.data} as VuexUserStateDataInterface;

    (data as any).name = data.userName;
    delete data.email;
    delete data.userName;

    AmplitudeService.profileInfo(data);

    return await userService.postProfile(data);
  },
  async [GET_SUBSCRIPTION_ACTION](context: ActionContext<VuexUserStateInterface, any>) {
    const userService = new UserService();
    const response = await userService.getSubscription();

    context.commit(SET_SUBSCRIPTION_MUTATION, response);
  },
  async [GET_PAYMENT_LINK_ACTION](context: ActionContext<VuexUserStateInterface, any>, subscriptionID: ActionContext<VuexUserStateInterface, any>) {
    const userService = new UserService();
    const response = await userService.getPaymentLink(subscriptionID);
    return response
  },
  async [GET_ALL_SUBSCRIBTIONS]() {
    const userService = new UserService();
    const response = await userService.getSubscriptions();
    return response
  },
  async [POST_CANCEL_SUBSCRIPTION]() {
    const userService = new UserService();
    const response = await userService.cancelSubscription();
    return response
  }
}