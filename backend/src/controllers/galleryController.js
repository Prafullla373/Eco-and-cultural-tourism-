import { GalleryImage } from "../models/GalleryImage.js";

export const addImage = async (req, res) => {
  try {
    const img = await GalleryImage.create(req.body);
    res.json(img);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getGallery = async (req, res) => {
  const data = await GalleryImage.find().populate("location");
  res.json(data);
};

export const getImageById = async (req, res) => {
  const data = await GalleryImage.findById(req.params.id);
  res.json(data);
};

export const deleteImage = async (req, res) => {
  await GalleryImage.findByIdAndDelete(req.params.id);
  res.json({ message: "Image deleted" });
};
