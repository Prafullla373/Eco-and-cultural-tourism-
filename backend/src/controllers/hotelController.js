// backend/src/controllers/hotelController.js
import Hotel from "../models/Hotel.js";

/* ---------------------- CREATE HOTEL ---------------------- */
export const addHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.json(hotel);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

/* ---------------------- GET ALL HOTELS ---------------------- */
export const getHotels = async (req, res) => {
  const hotels = await Hotel.find();
  res.json(hotels);
};

/* ---------------------- GET HOTEL BY ID ---------------------- */
export const getHotelById = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  res.json(hotel);
};

/* ---------------------- UPDATE HOTEL ---------------------- */
export const updateHotel = async (req, res) => {
  const updated = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

/* ---------------------- DELETE HOTEL ---------------------- */
export const deleteHotel = async (req, res) => {
  await Hotel.findByIdAndDelete(req.params.id);
  res.json({ message: "Hotel deleted" });
};

/* ---------------------- ADD REVIEW (AUTH REQUIRED) ---------------------- */
export const addHotelReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const hotel = await Hotel.findById(id);
    if (!hotel)
      return res.status(404).json({ message: "Hotel not found" });

    // prevent double review
    const already = hotel.reviews.find(
      (r) => r.user == req.user._id
    );
    if (already)
      return res
        .status(400)
        .json({ message: "You have already reviewed this hotel" });

    const newReview = {
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    hotel.reviews.push(newReview);

    hotel.numReviews = hotel.reviews.length;
    hotel.rating =
      hotel.reviews.reduce((acc, r) => acc + r.rating, 0) /
      hotel.numReviews;

    await hotel.save();

    res.json({ message: "Review added", hotel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding review" });
  }
};
