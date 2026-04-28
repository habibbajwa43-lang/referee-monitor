import { configureStore } from "@reduxjs/toolkit";
import refereeReducer from "../slices/refereeSlice";
import matchReducer from "../slices/matchSlice";
import uiReducer from "../slices/uiSlice";
import insightReducer from "../slices/insightSlice";

export const store = configureStore({
  reducer: {
    referee: refereeReducer,
    match: matchReducer,
    ui: uiReducer,
    insight: insightReducer,
  },
});