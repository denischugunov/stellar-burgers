import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setIngredient(state, action: { payload: TIngredient }) {
      if (action.payload.type === 'bun') {
        state.bun = { id: uuidv4(), ...action.payload };
      } else {
        state.ingredients.push({ id: uuidv4(), ...action.payload });
      }
    },
    moveUpIngredient(state, action: { payload: number }) {
      const index = action.payload;
      const movedIngredient = state.ingredients[index - 1];
      state.ingredients[index - 1] = state.ingredients[index];
      state.ingredients[index] = movedIngredient;
    },
    moveDownIngredient(state, action: { payload: number }) {
      const index = action.payload;
      const movedIngredient = state.ingredients[index + 1];
      state.ingredients[index + 1] = state.ingredients[index];
      state.ingredients[index] = movedIngredient;
    },
    removeIngredient(state, action: { payload: number }) {
      const index = action.payload;
      state.ingredients = state.ingredients.filter((_, i) => i !== index);
    },
    removeIngredients(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  setIngredient,
  moveUpIngredient,
  moveDownIngredient,
  removeIngredient,
  removeIngredients
} = constructorSlice.actions;

export default constructorSlice.reducer;
