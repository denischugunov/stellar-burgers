import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  initialState
} from '../src/services/slices/userSlice';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../src/services/store';
import reducer from '../src/services/slices/userSlice';

// ******************
// ****************** моки ********************
// ******************

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0
};

const userMockData = {
  email: 'testuser@example.com',
  name: 'Test User'
};

const registerUserMockResponse = {
  success: true,
  user: userMockData,
  accessToken: 'mockAccessToken',
  refreshToken: 'mockRefreshToken'
};

const loginUserMockResponse = {
  success: true,
  user: userMockData,
  accessToken: 'mockAccessToken',
  refreshToken: 'mockRefreshToken'
};

const getUserMockResponse = {
  success: true,
  user: userMockData
};

jest.mock('../src/utils/cookie', () => ({
  getCookie: jest.fn(() => 'mockAccessToken'),
  setCookie: jest.fn()
}));

// ******************
// ****************** тесты ********************
// ******************

describe('Проверка userSlice', () => {
  beforeEach(() => {
    jest.restoreAllMocks(); // Сбрасываем моки перед каждым тестом
  });

  describe('Тестирование регистрации пользователя', () => {
    test('Регистрация пользователя', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(registerUserMockResponse)
        })
      ) as jest.Mock;

      const store = configureStore({ reducer: rootReducer });

      const actionPromise = store.dispatch(
        registerUser({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        })
      );

      expect(store.getState().user.isLoginRequest).toBe(true);

      await actionPromise;

      const { userData, isAuth, error } = store.getState().user;

      expect(userData).toEqual(userMockData);
      expect(isAuth).toBe(true);
      expect(error).toBe('');
    });

    test('Ошибка регистрации', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve('Ошибка')
        })
      ) as jest.Mock;

      const store = configureStore({ reducer: rootReducer });

      const actionPromise = store.dispatch(
        registerUser({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        })
      );

      expect(store.getState().user.isLoginRequest).toBe(true);

      await actionPromise;

      const { userData, isAuth, error } = store.getState().user;

      expect(userData).toBeNull();
      expect(isAuth).toBe(false);
      expect(error).toBe('Ошибка');
    });
  });

  describe('Тестирование входа пользователя', () => {
    test('Успешный вход', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(loginUserMockResponse)
        })
      ) as jest.Mock;

      const store = configureStore({ reducer: rootReducer });

      const action = store.dispatch(
        loginUser({ email: 'test@example.com', password: 'password123' })
      );

      expect(store.getState().user.isLoginRequest).toBe(true);

      await action;

      const { userData, isAuth, error } = store.getState().user;

      expect(userData).toEqual(userMockData);
      expect(isAuth).toBe(true);
      expect(error).toBe('');
    });

    test('Ошибка входа', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve('Ошибка')
        })
      ) as jest.Mock;

      const store = configureStore({ reducer: rootReducer });

      const action = store.dispatch(
        loginUser({ email: 'test@example.com', password: 'password123' })
      );

      expect(store.getState().user.isLoginRequest).toBe(true);

      await action;

      const { userData, isAuth, error } = store.getState().user;

      expect(userData).toBeNull();
      expect(isAuth).toBe(false);
      expect(error).toBe('Ошибка');
    });
  });

  describe('Тестирование выхода пользователя', () => {
    test('Выход пользователя', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock;

      const store = configureStore({ reducer: rootReducer });

      const action = store.dispatch(logoutUser());

      expect(store.getState().user.isLoginRequest).toBe(true);

      await action;

      const { userData, isAuth } = store.getState().user;

      expect(userData).toBeNull();
      expect(isAuth).toBe(false);
    });
  });

  describe('Тестирование получения данных пользователя', () => {
    test('Успешное получение', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(getUserMockResponse)
        })
      ) as jest.Mock;

      const store = configureStore({ reducer: rootReducer });

      const action = store.dispatch(getUser());

      expect(store.getState().user.isLoginRequest).toBe(true);

      await action;

      const { userData, isAuth } = store.getState().user;

      expect(userData).toEqual(userMockData);
      expect(isAuth).toBe(true);
    });

    test('Ошибка получения', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve('Ошибка')
        })
      ) as jest.Mock;

      const store = configureStore({ reducer: rootReducer });

      const action = store.dispatch(getUser());

      expect(store.getState().user.isLoginRequest).toBe(true);

      await action;

      const { userData, isLoginRequest, error } = store.getState().user;

      expect(userData).toBeNull();
      expect(isLoginRequest).toBe(false);
      expect(error).toEqual('Ошибка');
    });
  });

  describe('Тестирование userReducer', () => {
    describe('Асинхронная функция редактирования информации пользователя: updateUser', () => {
      test('Начало запроса: updateUser.pending', () => {
        const state = reducer(
          initialState,
          updateUser.pending('pending', userMockData)
        );

        expect(state.isLoginRequest).toBeTruthy();
        expect(state.error).toBe('');
      });

      test('Результат запроса: updateUser.fulfilled', () => {
        const state = reducer(
          { ...initialState, userData: userMockData },
          updateUser.fulfilled(userMockData, 'fulfilled', userMockData)
        );

        expect(state.isLoginRequest).toBeFalsy();
        expect(state.userData).toEqual(userMockData);
        expect(state.error).toBe('');
      });

      test('Ошибка запроса: updateUser.rejected', () => {
        const error = 'updateUser.rejected';

        const state = reducer(
          initialState,
          updateUser.rejected(new Error(error), 'rejected', userMockData)
        );

        expect(state.isLoginRequest).toBeFalsy();
        expect(state.error).toEqual(error);
      });
    });
  });
});
