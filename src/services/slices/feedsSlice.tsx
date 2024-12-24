import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrdersData } from '@utils-types';

type TFeedsState = {
  loading: boolean;
  error: null | SerializedError;
  data: TOrdersData;
};

export const initialState: TFeedsState = {
  loading: true,
  error: null,
  data: {
    orders: [],
    total: 0,
    totalToday: 0
  }
};

export const getFeeds = createAsyncThunk('feed/getAll', async () =>
  getFeedsApi()
);

const feedsSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  }
});

const { actions, reducer } = feedsSlice;

export const {} = actions;

export default reducer;
