import {AuthRepository} from "@/repositories/auth_repository";
import {TokenService, TokenType} from "@/services/token_service";
import {AxiosError, AxiosResponse} from "axios";
import router from "@/router";
import store from "@/store";
import {LOGIN_MUTATION, LOGOUT_MUTATION} from "@/store/modules/auth/constants";
import {LOGOUT_ACTION} from "@/store/modules/user/constants";

export class AuthService {
  private authRepo = new AuthRepository();

  private refreshPromise: Promise<boolean> | null = null;
  private isRefreshing = false;

  private static instance: AuthService;

  /* eslint @typescript-eslint/no-empty-function: ["error", { "allow": ["constructors"] }]*/
  private constructor() {
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  private errorsMap = {
    401: 'Неверный Email или пароль',
    400: 'Email занят',
  };

  async authorize(email: string, password: string): Promise<boolean | string> {
    try {
      const response = await this.authRepo.obtainToken(email, password);
      const tokens = response.data as Record<string, string>;

      const tokenService = new TokenService();
      tokenService.persistToken(TokenType.ACCESS_TOKEN, tokens['access']);
      tokenService.persistToken(TokenType.REFRESH_TOKEN, tokens['refresh']);

      store.commit('auth/' + LOGIN_MUTATION, {
        [TokenType.ACCESS_TOKEN]: tokens['access'],
        [TokenType.REFRESH_TOKEN]: tokens['refresh']
      });

      // carrot tracking

      window.carrotquest.track("$authorized", {"$email": email, "$name": email})

      return true;
    } catch (e) {
      const _e = e as AxiosError;
      if (_e.response && _e.response.status === 401) {
        return this.errorsMap[401];
      }

      return e;
    }
  }

  async register(email: string, password: string, name: string, phoneNumber: string, code: string): Promise<boolean | string> {
    try {
      const response = await this.authRepo.register(email, password, name, phoneNumber);
      /*eslint-disable */
      window.carrotquest.track("$registered", { "$email": email, "$name": email })
      window.carrotquest.identify([
        { op: "update_or_create", key: "$phone", value: phoneNumber },
      ]);
      window.carrotquest.track('Promocode activated', {
        'Promocode': code
      });
      window.carrotquest.track('Registration date', {
        'date': `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`
      });
      /*eslint-enable */
      return response.status === 201;
    } catch (e) {
      const _e = e as AxiosError;

      if (_e.response && _e.response.status === 400) {
        return this.errorsMap[400] || _e.response.data.detail;
      }

      return false;
    }
  }

  async getPromocode(code: string) {
    try {
      const response = await this.authRepo.getPromocode(code)
      return response
    } catch (e) {
      const _e = e as AxiosError;
      return _e.response
    }
  }

  async setPromocode(code: string, email: string) {
    try {
      const response = await this.authRepo.setPromocode(code, email)
      return response
    } catch (e) {
      const _e = e as AxiosError;
      if (_e.response && _e.response.status === 400) {
        return _e.response.data.detail
      }
    }
  }

  // данная реализация обертки позволяет ждать обновления токена,
  // а не дергать каждый раз refresh. Актуально для кейсов,
  // когда дергается сразу несколько сетевых запросов и access-токен по какой-то причине не рабочий
  private async refreshToken(): Promise<boolean> {
    this.isRefreshing = true;
    return new Promise(refreshTokenResolver => {
      const tokenService = new TokenService();
      if (tokenService.hasToken(TokenType.REFRESH_TOKEN)) {
        Promise.resolve(true)
          .then(() => this.authRepo.refreshToken(tokenService.getToken(TokenType.REFRESH_TOKEN)))
          .then((response: AxiosResponse) => {
            tokenService.persistToken(TokenType.ACCESS_TOKEN, response.data['access']);
            this.isRefreshing = false;
            refreshTokenResolver(true);
          })
          .catch(() => refreshTokenResolver(false));
      } else {
        refreshTokenResolver(false);
      }
    });
  }

  async logout(): Promise<void> {
    const tokenService = new TokenService();
    tokenService.clear();

    store.commit(`auth/${LOGOUT_MUTATION}`);
  }

  async sendPasswordResetLink(email: string): Promise<boolean> {
    try {
      const response = await this.authRepo.sendPasswordResetLink(email);

      return response.status === 200;
    } catch (e) {
      return false;
    }
  }

  async setPassword(newPassword: string, uidb64: string, token: string) {
    try {
      const response = await this.authRepo.setPassword(newPassword, uidb64, token);

      return response.status === 200;
    } catch (e) {
      return false;
    }
  }

  async refreshWrapper(cb: () => Promise<AxiosResponse>) {
    try {
      return await cb();
    } catch (e) {
      const _e = e as AxiosError;
      if (_e.response && _e.response.status === 401) {
        if (!(this.refreshPromise instanceof Promise) || !this.isRefreshing) {
          this.refreshPromise = this.refreshToken();
        }
        return await this.refreshPromise.then(async result => {
          if (result) {
            // токен успешно обновился
            return await cb();
          } else {
            const tokenService = new TokenService();
            tokenService.clear();

            await store.commit(`auth/${LOGOUT_ACTION}`);
            await router.push(({name: 'auth.login'}));

            throw e
          }
        });
      }

      throw e;
    }
  }
}