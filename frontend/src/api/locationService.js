import axios from "axios";

const API_URL = "http://localhost:5000/api/locations";

export const getLocations = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getLocationById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const addLocation = async (locationData) => {
    const response = await axios.post(API_URL, locationData, { withCredentials: true });
    return response.data;
};

export const updateLocation = async (id, locationData) => {
    const response = await axios.put(`${API_URL}/${id}`, locationData, { withCredentials: true });
    return response.data;
};

export const deleteLocation = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
    return response.data;
};
