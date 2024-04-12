import { configureStore } from '@reduxjs/toolkit';
import paginationReducer from './slice';
import { todoApi } from './service';

export const store = configureStore({
  reducer: {
    pagination: paginationReducer,
    [todoApi.reducerPath]: todoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;