import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@/services/auth.service';
import type {
  LoginPayload,
  RegisterPayload,
  User,
} from '@/types/auth.types';

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

function extractErrorMessage(error: unknown): string {
  const anyErr = error as { response?: { data?: { message?: string } } };
  return anyErr?.response?.data?.message ?? 'Something went wrong';
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await authApi.register(payload);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      return await authApi.login(payload);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/me',
  async (_: void, { rejectWithValue }) => {
    try {
      return await authApi.me();
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionExpired: (state) => {
      state.user = null;
      state.status = 'unauthenticated';
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'authenticated';
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'authenticated';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.payload as string;
      })
      // Fetch current user (used on app load to restore session from cookie)
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'authenticated';
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
      });
  },
});

export const { sessionExpired } = authSlice.actions;
export default authSlice.reducer;
