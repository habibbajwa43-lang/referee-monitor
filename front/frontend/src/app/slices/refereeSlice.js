import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRefProfiles, getRefProfileById } from "../../services/refereeApi";

export const fetchRefProfiles = createAsyncThunk(
  "referee/fetchRefProfiles",
  async (_, thunkAPI) => {
    try {
      const data = await getRefProfiles();
      localStorage.setItem("ref_profiles_cache", JSON.stringify(data));
      return data;
    } catch (error) {
      const cached = localStorage.getItem("ref_profiles_cache");
      if (cached) return JSON.parse(cached);

      return thunkAPI.rejectWithValue(
        error?.message || "Failed to fetch referee profiles"
      );
    }
  }
);

export const fetchRefProfileById = createAsyncThunk(
  "referee/fetchRefProfileById",
  async (refId, thunkAPI) => {
    try {
      return await getRefProfileById(refId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to fetch referee profile"
      );
    }
  }
);

const initialState = {
  list: [],
  selected: null,
  selectedById: {},
  loading: false,
  error: null,
  search: "",
  leagueFilter: "all",
  countryFilter: "all",
  seasonFilter: "2025/26",
  sortMetric: "rmScore",
};

const refereeSlice = createSlice({
  name: "referee",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setLeagueFilter(state, action) {
      state.leagueFilter = action.payload;
    },
    setCountryFilter(state, action) {
      state.countryFilter = action.payload;
    },
    setSeasonFilter(state, action) {
      state.seasonFilter = action.payload;
    },
    setSortMetric(state, action) {
      state.sortMetric = action.payload;
    },
    setSelectedRefereeFromCache(state, action) {
      const refId = action.payload;
      state.selected = state.selectedById[refId] || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRefProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRefProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || state.list;
      })
      .addCase(fetchRefProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRefProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRefProfileById.fulfilled, (state, action) => {
        state.loading = false;
        const profile = action.payload || null;
        state.selected = profile;

        if (profile?.referee_id) {
          state.selectedById[profile.referee_id] = profile;
        }
      })
      .addCase(fetchRefProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearch,
  setLeagueFilter,
  setCountryFilter,
  setSeasonFilter,
  setSortMetric,
  setSelectedRefereeFromCache,
} = refereeSlice.actions;

export default refereeSlice.reducer;