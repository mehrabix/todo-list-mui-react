import { createSlice } from "@reduxjs/toolkit";

const paginationSlice = createSlice({
    name: 'pagination',
    initialState: { page: 0, pageSize: 5 },
    reducers: {
      setPage(state, action) {
        state.page = action.payload;
      },
      setPageSize(state, action) {
        state.pageSize = action.payload;
      },
    },
  });
  
  export const { setPage, setPageSize } = paginationSlice.actions;
  
  export default paginationSlice.reducer;