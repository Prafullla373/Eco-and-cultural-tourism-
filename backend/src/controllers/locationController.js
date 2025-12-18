import { Location } from "../models/Location.js";

export const addLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.json(location);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getLocations = async (req, res) => {
  const data = await Location.find();
  res.json(data);
};

export const getLocationById = async (req, res) => {
  const data = await Location.findById(req.params.id);
  res.json(data);
};

export const updateLocation = async (req, res) => {
  const updated = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteLocation = async (req, res) => {
  await Location.findByIdAndDelete(req.params.id);
  res.json({ message: "Location deleted" });
};
