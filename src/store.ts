import { configureStore } from '@reduxjs/toolkit';
import appReducer from '@/app/reducer';
import { todoApi } from '@/app/service';

export const store = configureStore({
  reducer: {
    app: appReducer,
    [todoApi.reducerPath]: todoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;