import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../../utils/burger-api';
import { TOrder } from '@utils-types';

type TOrderState = {
  loading: boolean;
  error: null | SerializedError;
  data: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

export const initialState: TOrderState = {
  loading: true,
  error: null,
  data: [],
  orderRequest: false,
  orderModalData: null
};

export const getOrders = createAsyncThunk('orders/getAll', async () =>
  getOrdersApi()
);

export const getOrder = createAsyncThunk(
  'orders/getOrder',
  async (id: number) => {
    const { orders } = await getOrderByNumberApi(id);
    return orders[0];
  }
);

export const setOrder = createAsyncThunk(
  'orders/setOrder',
  async (data: string[]) => orderBurgerApi(data)
);

const ingredientsSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder(state) {
      state.data = [];
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(setOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(setOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error;
      })
      .addCase(setOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        const { order, name } = action.payload;
        state.orderModalData = order;
        state.data = [order, ...state.data];
      })
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderModalData = action.payload;
      });
  }
});

const { actions, reducer } = ingredientsSlice;

export const { clearOrder } = actions;

export default reducer;
