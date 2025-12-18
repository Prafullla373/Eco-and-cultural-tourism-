import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // change if backend uses a different port

export const getExploreItems = async (filters = {}) => {
  const params = {};

  if (filters.category && filters.category !== "All") {
    params.category = filters.category;
  }

  if (filters.location && filters.location !== "All") {
    params.location = filters.location;
  }

  if (filters.rating) {
    params.minRating = filters.rating;
  }

  if (filters.search) {
    params.search = filters.search;
  }

  const res = await axios.get(`${API_BASE}/explore`, { params });
  return res.data;
};

export const getExploreItemById = async (id) => {
  const res = await axios.get(`${API_BASE}/explore/${id}`);
  return res.data;
};
