import { Handicraft } from "../models/Handicraft.js";

export const addHandicraft = async (req, res) => {
  try {
    const data = await Handicraft.create(req.body);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getHandicrafts = async (req, res) => {
  const data = await Handicraft.find();
  res.json(data);
};

export const getHandicraftById = async (req, res) => {
  const data = await Handicraft.findById(req.params.id);
  res.json(data);
};

export const updateHandicraft = async (req, res) => {
  const updated = await Handicraft.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteHandicraft = async (req, res) => {
  await Handicraft.findByIdAndDelete(req.params.id);
  res.json({ message: "Handicraft deleted" });
};
