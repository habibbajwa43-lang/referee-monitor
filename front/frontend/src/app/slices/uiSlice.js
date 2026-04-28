import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mobileMenuOpen: false,
  sidebarOpen: true,
  selectedSeason: "2025/26",
  activeInsightCategory: "all",
  globalLoading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },

    setMobileMenuOpen(state, action) {
      state.mobileMenuOpen = action.payload;
    },

    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },

    setSelectedSeason(state, action) {
      state.selectedSeason = action.payload;
    },

    setActiveInsightCategory(state, action) {
      state.activeInsightCategory = action.payload;
    },

    setGlobalLoading(state, action) {
      state.globalLoading = action.payload;
    },
  },
});

export const {
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleSidebar,
  setSidebarOpen,
  setSelectedSeason,
  setActiveInsightCategory,
  setGlobalLoading,
} = uiSlice.actions;

// 🔥 IMPORTANT LINE (ye missing thi)
export default uiSlice.reducer;