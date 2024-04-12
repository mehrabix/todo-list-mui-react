import { configureStore } from '@reduxjs/toolkit';
import appReducer from '@/app/reducer';
import { todoService } from '@/app/service';

export const store = configureStore({
  reducer: {
    app: appReducer,
    [todoService.reducerPath]: todoService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todoService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;