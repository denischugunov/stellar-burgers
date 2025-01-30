import { expect, test, describe, beforeEach } from '@jest/globals';
import { TConstructorIngredient } from '../src/utils/types';
import constructorSliceReducer, {
  setIngredient,
  moveUpIngredient,
  moveDownIngredient,
  removeIngredient,
  removeIngredients
} from '../src/services/slices/constructorSlice';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-unique-id')
}));

describe('тесты конструктора бургеров', () => {
  let initialState: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };

  // Пересоздаем initialState перед каждым тестом
  beforeEach(() => {
    initialState = {
      bun: null,
      ingredients: []
    };
  });

  const mockDataBun = {
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
  };

  const mockDataIngredientMain = {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    __v: 0
  };

  const mockDataIngredientSauce = {
    _id: '643d69a5c3f7b9001cfa0945',
    name: 'Соус с шипами Антарианского плоскоходца',
    type: 'sauce',
    proteins: 101,
    fat: 99,
    carbohydrates: 100,
    calories: 100,
    price: 88,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
    __v: 0
  };

  test('добавить булку и начинку в стор', () => {
    let state = constructorSliceReducer(
      initialState,
      setIngredient(mockDataBun)
    );
    state = constructorSliceReducer(
      state,
      setIngredient(mockDataIngredientMain)
    );

    expect(state.bun).toMatchObject({
      id: 'mocked-unique-id',
      ...mockDataBun
    });

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject({
      id: 'mocked-unique-id',
      ...mockDataIngredientMain
    });
  });

  test('удалить начинку по отдельности', () => {
    let state = constructorSliceReducer(
      initialState,
      setIngredient(mockDataIngredientSauce)
    );
    state = constructorSliceReducer(
      state,
      setIngredient(mockDataIngredientMain)
    );

    state = constructorSliceReducer(state, removeIngredient(1));
    state = constructorSliceReducer(state, removeIngredient(0));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  test('удалить все ингредиенты', () => {
    let state = constructorSliceReducer(
      initialState,
      setIngredient(mockDataBun)
    );
    state = constructorSliceReducer(
      state,
      setIngredient(mockDataIngredientMain)
    );

    state = constructorSliceReducer(state, removeIngredients());

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  test('проверить перемещение начинки вверх', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [
        {
          id: 'mocked-unique-id',
          ...mockDataIngredientMain
        },
        {
          id: 'mocked-unique-id',
          ...mockDataIngredientSauce
        }
      ]
    };

    const state = constructorSliceReducer(
      stateWithIngredients,
      moveUpIngredient(1)
    );

    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toEqual({
      id: 'mocked-unique-id',
      ...mockDataIngredientSauce
    });
    expect(state.ingredients[1]).toEqual({
      id: 'mocked-unique-id',
      ...mockDataIngredientMain
    });
    expect(state.bun).toBeNull();
  });

  test('проверить перемещение начинки вниз', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [
        {
          id: 'mocked-unique-id',
          ...mockDataIngredientMain
        },
        {
          id: 'mocked-unique-id',
          ...mockDataIngredientSauce
        }
      ]
    };

    const state = constructorSliceReducer(
      stateWithIngredients,
      moveDownIngredient(0)
    );

    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toEqual({
      id: 'mocked-unique-id',
      ...mockDataIngredientSauce
    });
    expect(state.ingredients[1]).toEqual({
      id: 'mocked-unique-id',
      ...mockDataIngredientMain
    });
    expect(state.bun).toBeNull();
  });
});
