import axios from "axios";

const API_URL = "http://localhost:5000/api/packages";

export const getPackages = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getPackageById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const addPackage = async (packageData) => {
    const response = await axios.post(API_URL, packageData, { withCredentials: true });
    return response.data;
};

export const updatePackage = async (id, packageData) => {
    const response = await axios.put(`${API_URL}/${id}`, packageData, { withCredentials: true });
    return response.data;
};

export const deletePackage = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
    return response.data;
};
