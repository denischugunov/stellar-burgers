import { configureStore } from '@reduxjs/toolkit';
import { rootReducer, store } from '../src/services/store';

describe('проверка инициализации rootReducer', () => {
  test('снепшот должен показать начальное состояние стора', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    expect(store.getState()).toMatchSnapshot();
  });

  test('Вызов rootReducer с UNKNOWN_ACTION и undefined', () => {
    const init = store.getState();

    const after = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(after).toEqual(init);
  });
});
