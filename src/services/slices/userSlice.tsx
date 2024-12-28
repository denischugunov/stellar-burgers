import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

type TUserState = {
  isAuth: boolean;
  isLoginRequest: boolean;
  error: string | undefined;
  userData: TUser | null;
};

const initialState: TUserState = {
  isAuth: false,
  isLoginRequest: false,
  error: '',
  userData: null
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const { refreshToken, accessToken, user } = await registerUserApi(data);
    setCookie('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const { refreshToken, accessToken, user } = await loginUserApi(data);
    setCookie('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    updateUserApi(data);
    return data;
  }
);

export const getUser = createAsyncThunk('user/getUser', async () =>
  getUserApi()
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoginRequest = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuth = false;
        state.isLoginRequest = false;
        state.error = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state, action: { payload: TUser }) => {
        state.isAuth = true;
        state.isLoginRequest = false;
        state.userData = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoginRequest = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuth = false;
        state.isLoginRequest = false;
        state.error = action.error.message;
      })
      .addCase(loginUser.fulfilled, (state, action: { payload: TUser }) => {
        state.isAuth = true;
        state.isLoginRequest = false;
        state.userData = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoginRequest = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoginRequest = false;
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = false;
        state.isLoginRequest = false;
        console.log(1);
        state.userData = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoginRequest = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoginRequest = false;
        state.error = action.error.message;
      })
      .addCase(
        updateUser.fulfilled,
        (state, action: { payload: Partial<TRegisterData> }) => {
          state.isLoginRequest = false;
          if (state.userData) {
            state.userData = {
              ...state.userData,
              ...action.payload
            };
          }
        }
      )
      .addCase(getUser.pending, (state) => {
        state.isLoginRequest = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.userData = null;
        state.isLoginRequest = false;
        state.error = action.error.message!;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        console.log(action.payload, 888);
        state.isLoginRequest = false;
        state.isAuth = true;
      });
  }
});

const { actions, reducer } = userSlice;

export const {} = actions;

export default reducer;
