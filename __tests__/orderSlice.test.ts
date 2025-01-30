import {
  getOrders,
  getOrder,
  setOrder
} from '../src/services/slices/orderSlice';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../src/services/store';

const orderRequestData = [
  '643d69a5c3f7b9001cfa093d',
  '643d69a5c3f7b9001cfa0941',
  '643d69a5c3f7b9001cfa093d'
];

const orderCreateResponseMockData = {
  name: 'Флюоресцентный био-марсианский бургер',
  order: {
    ingredients: [
      {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3',
        type: 'bun',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
        __v: 0
      },
      {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        __v: 0
      },
      {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3',
        type: 'bun',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
        __v: 0
      }
    ],
    _id: '679b5526133acd001be4d736',
    owner: {
      name: 'Denis',
      email: 'denis.chugunov98@gmail.com',
      createdAt: '2024-12-27T10:25:23.850Z',
      updatedAt: '2024-12-28T08:34:50.496Z'
    },
    status: 'done',
    name: 'Флюоресцентный био-марсианский бургер',
    createdAt: '2025-01-30T10:32:06.613Z',
    updatedAt: '2025-01-30T10:32:07.335Z',
    number: 67203,
    price: 2400
  }
};

const orderGetAllMockData = {
  orders: [
    {
      _id: '676ec568750864001d3764ed',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Флюоресцентный люминесцентный био-марсианский бургер',
      createdAt: '2024-12-27T15:19:04.457Z',
      updatedAt: '2024-12-27T15:19:05.437Z',
      number: 64449
    },
    {
      _id: '676ec6c0750864001d3764f2',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0949',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Экзо-плантаго флюоресцентный люминесцентный бургер',
      createdAt: '2024-12-27T15:24:48.386Z',
      updatedAt: '2024-12-27T15:24:49.341Z',
      number: 64450
    },
    {
      _id: '679b5526133acd001be4d736',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Флюоресцентный био-марсианский бургер',
      createdAt: '2025-01-30T10:32:06.613Z',
      updatedAt: '2025-01-30T10:32:07.335Z',
      number: 67203
    }
  ],
  total: 66831,
  totalToday: 66
};

const orderGetConcreteMockData = {
  orders: [
    {
      _id: '679b5526133acd001be4d736',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093d'
      ],
      owner: '676e8093750864001d3763a6',
      status: 'done',
      name: 'Флюоресцентный био-марсианский бургер',
      createdAt: '2025-01-30T10:32:06.613Z',
      updatedAt: '2025-01-30T10:32:07.335Z',
      number: 67203,
      __v: 0
    }
  ]
};

jest.mock('../src/utils/cookie', () => ({
  getCookie: jest.fn(() => 'mockAccessToken')
}));

describe('Проверка orderSlice', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('Тестирование асинхронного экшена получения данных всех заказов пользователя', () => {
    test('Успешная загрузка и изменение loading', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              ...orderGetAllMockData
            })
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: rootReducer
      });

      const actionPromise = store.dispatch(getOrders());

      expect(store.getState().order.loading).toBe(true);

      await actionPromise;

      const { data, loading, error } = store.getState().order;
      expect(data).toEqual(orderGetAllMockData.orders);
      expect(loading).toBe(false);
      expect(error).toBeNull();
    });
  });

  describe('Тестирование асинхронного экшена получения конкретного заказа пользователя', () => {
    test('Успешная загрузка и изменение loading', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              ...orderGetConcreteMockData
            })
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: rootReducer
      });

      const testId = 67203;
      const actionPromise = store.dispatch(getOrder(testId));

      expect(store.getState().order.loading).toBe(true);

      await actionPromise;

      const { orderModalData, loading, error } = store.getState().order;
      expect(orderModalData).toEqual(orderGetConcreteMockData.orders[0]);
      expect(loading).toBe(false);
      expect(error).toBeNull();
    });
  });

  describe('Тестирование асинхронного экшена отправки данных заказа пользователя', () => {
    test('Успешная отправка и изменение orderRequest', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              ...orderCreateResponseMockData
            })
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: rootReducer
      });

      const actionPromise = store.dispatch(setOrder(orderRequestData));

      expect(store.getState().order.orderRequest).toBe(true);

      await actionPromise;

      const { orderModalData, orderRequest, error } = store.getState().order;
      expect(orderModalData).toEqual(orderCreateResponseMockData.order);
      expect(orderRequest).toBe(false);
      expect(error).toBeNull();
    });
  });
});
