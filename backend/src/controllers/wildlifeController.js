import { Wildlife } from "../models/Wildlife.js";

export const addWildlife = async (req, res) => {
  try {
    const data = await Wildlife.create(req.body);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getWildlife = async (req, res) => {
  const data = await Wildlife.find().populate("location");
  res.json(data);
};

export const getWildlifeById = async (req, res) => {
  const data = await Wildlife.findById(req.params.id).populate("location");
  res.json(data);
};

export const updateWildlife = async (req, res) => {
  const updated = await Wildlife.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteWildlife = async (req, res) => {
  await Wildlife.findByIdAndDelete(req.params.id);
  res.json({ message: "Wildlife deleted" });
};
