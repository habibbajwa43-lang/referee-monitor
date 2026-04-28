import apiClient from "./apiClient";

export const getRefProfiles = async () => {
  const { data } = await apiClient.get("/ref_profiles");
  return Array.isArray(data) ? data : [];
};

export const getRefProfileById = async (refId) => {
  const { data } = await apiClient.get(`/ref_profile?ref_id=${refId}`);
  return Array.isArray(data) ? data[0] || null : null;
};

export const getRefSeasonData = async (refId) => {
  const { data } = await apiClient.get(`/ref_profiles_season?ref_id=${refId}`);
  return Array.isArray(data) ? data : [];
};

export const getRefCareerData = async (refId) => {
  const { data } = await apiClient.get(`/ref_profiles_career?ref_id=${refId}`);
  return Array.isArray(data) ? data[0] || null : null;
};