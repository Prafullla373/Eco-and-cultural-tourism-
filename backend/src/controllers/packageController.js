import { Package } from "../models/Package.js";

export const addPackage = async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.json(pkg);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getPackages = async (req, res) => {
  const data = await Package.find().populate("location");
  res.json(data);
};

export const getPackageById = async (req, res) => {
  const data = await Package.findById(req.params.id).populate("location");
  res.json(data);
};

export const updatePackage = async (req, res) => {
  const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deletePackage = async (req, res) => {
  await Package.findByIdAndDelete(req.params.id);
  res.json({ message: "Package deleted" });
};
