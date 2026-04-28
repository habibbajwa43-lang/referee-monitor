import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const insightSlice = createSlice({
  name: "insight",
  initialState,
  reducers: {
    setInsights(state, action) {
      state.list = action.payload;
    },
  },
});

export const { setInsights } = insightSlice.actions;


export default insightSlice.reducer;