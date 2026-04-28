import apiClient from "./apiClient";

export const getFixturePredictions = async () => {
  const { data } = await apiClient.get("/fixture_predictions");
  return Array.isArray(data) ? data : [];
};

export const getFixtureScore = async (fixtureId) => {
  const { data } = await apiClient.get(`/fixture_score?fixture_id=${fixtureId}`);
  return Array.isArray(data) ? data[0] || null : null;
};