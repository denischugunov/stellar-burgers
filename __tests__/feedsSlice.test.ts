import { getFeeds } from '../src/services/slices/feedsSlice';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../src/services/store';

const feedMockData = {
  orders: [
    {
      _id: '679b4baa133acd001be4d71b',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Краторный био-марсианский бургер',
      createdAt: '2025-01-30T09:51:38.579Z',
      updatedAt: '2025-01-30T09:51:39.200Z',
      number: 67201
    }
  ],
  total: 66827,
  totalToday: 64
};

describe('Проверка feedsSlice', () => {
  beforeEach(() => {
    jest.restoreAllMocks(); // Сбрасываем моки перед каждым тестом
  });

  describe('Тестирование асинхронных экшенов', () => {
    test('Загрузка очереди (успешная + pending)', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              ...feedMockData
            })
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: rootReducer
      });

      const action = store.dispatch(getFeeds());
      expect(store.getState().feed.loading).toBe(true);
      await action;
      expect(store.getState().feed.loading).toBe(false);
      expect(store.getState().feed.data).toEqual({
        success: true,
        ...feedMockData
      });
    });

    test('Ошибка загрузки очереди (rejected + pending)', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: 'Ошибка загрузки' })
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: rootReducer
      });

      const action = store.dispatch(getFeeds());
      expect(store.getState().feed.loading).toBe(true);
      await action;
      expect(store.getState().feed.loading).toBe(false);
      expect(store.getState().feed.data).toEqual({
        orders: [],
        total: 0,
        totalToday: 0
      });
      expect(store.getState().feed.error?.message).toBe('Ошибка загрузки');
    });
  });
});
