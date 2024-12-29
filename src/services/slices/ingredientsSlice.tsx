import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';

type TIngredientsState = {
  loading: boolean;
  error: null | SerializedError;
  data: TIngredient[];
};

export const initialState: TIngredientsState = {
  loading: true,
  error: null,
  data: []
};

export const getIngredients = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  }
});

const { actions, reducer } = ingredientsSlice;

export const {} = actions;

export default reducer;
