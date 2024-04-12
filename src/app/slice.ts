import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaginationState {
  page: number;
  pageSize: number;
  columnFilters: Record<string, any>;
  sorting: string;
}

const initialState: PaginationState = {
  page: 0,
  pageSize: 5,
  columnFilters: {},
  sorting: '',
};

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    },
    setColumnFilter(state, action: PayloadAction<{ field: string; value: any }>) {
      state.columnFilters[action.payload.field] = action.payload.value;
    },
    setSorting(state, action: PayloadAction<string>) {
      state.sorting = action.payload;
    },
  },
});

export const { setPage, setPageSize, setColumnFilter, setSorting } = paginationSlice.actions;
export default paginationSlice.reducer;
