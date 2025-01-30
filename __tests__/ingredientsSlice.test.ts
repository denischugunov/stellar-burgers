import {
  initialState,
  getIngredients
} from '../src/services/slices/ingredientsSlice';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../src/services/store';

const ingredientsMockData = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  }
];

describe('Проверка ingredientsSlice', () => {
  beforeEach(() => {
    jest.restoreAllMocks(); // Сбрасываем моки перед каждым тестом
  });

  describe('Тестирование асинхронных экшенов', () => {
    test('Загрузка ингредиентов (успешная + pending)', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              data: ingredientsMockData
            })
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: rootReducer
      });

      const action = store.dispatch(getIngredients());
      expect(store.getState().ingredients.loading).toBe(true);
      await action;
      expect(store.getState().ingredients.loading).toBe(false);
      expect(store.getState().ingredients.data).toEqual(ingredientsMockData);
    });

    test('Ошибка загрузки ингредиентов (rejected + pending)', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: 'Ошибка загрузки' })
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: rootReducer
      });

      const action = store.dispatch(getIngredients());
      expect(store.getState().ingredients.loading).toBe(true);
      await action;
      expect(store.getState().ingredients.loading).toBe(false);
      expect(store.getState().ingredients.data).toEqual([]);
      expect(store.getState().ingredients.error?.message).toBe(
        'Ошибка загрузки'
      );
    });
  });
});
