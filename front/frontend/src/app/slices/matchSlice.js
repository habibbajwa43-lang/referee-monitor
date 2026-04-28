import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getFixturePredictions,
  getFixtureScore,
} from "../../services/fixtureApi";

export const fetchFixturePredictions = createAsyncThunk(
  "match/fetchFixturePredictions",
  async (_, thunkAPI) => {
    try {
      const data = await getFixturePredictions();
      localStorage.setItem("fixture_predictions_cache", JSON.stringify(data));
      return data;
    } catch (error) {
      const cached = localStorage.getItem("fixture_predictions_cache");

      if (cached) {
        return JSON.parse(cached);
      }

      return thunkAPI.rejectWithValue(
        error?.message || "Failed to fetch fixture predictions"
      );
    }
  }
);

export const fetchFixtureById = createAsyncThunk(
  "match/fetchFixtureById",
  async (fixtureId, thunkAPI) => {
    try {
      return await getFixtureScore(fixtureId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to fetch fixture detail"
      );
    }
  }
);

const initialState = {
  list: [],
  selected: null,
  selectedById: {},
  featured: null,
  loading: false,
  error: null,
  riskFilter: "all",
  seasonFilter: "all",
  search: "",
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setRiskFilter(state, action) {
      state.riskFilter = action.payload;
    },
    setMatchSeasonFilter(state, action) {
      state.seasonFilter = action.payload;
    },
    setMatchSearch(state, action) {
      state.search = action.payload;
    },
    setSelectedMatchFromCache(state, action) {
      const fixtureId = action.payload;
      state.selected = state.selectedById[fixtureId] || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFixturePredictions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFixturePredictions.fulfilled, (state, action) => {
        const fixtures = action.payload || state.list;

        state.loading = false;
        state.list = fixtures;
        state.featured =
          fixtures.find((item) => item.risk_band === "RED") ||
          fixtures.find((item) => item.risk_band === "AMBER") ||
          fixtures[0] ||
          state.featured;
      })
      .addCase(fetchFixturePredictions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFixtureById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFixtureById.fulfilled, (state, action) => {
        state.loading = false;
        const fixture = action.payload || null;
        state.selected = fixture;

        if (fixture?.fixture_id) {
          state.selectedById[fixture.fixture_id] = fixture;
        }
      })
      .addCase(fetchFixtureById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setRiskFilter,
  setMatchSeasonFilter,
  setMatchSearch,
  setSelectedMatchFromCache,
} = matchSlice.actions;

export default matchSlice.reducer;