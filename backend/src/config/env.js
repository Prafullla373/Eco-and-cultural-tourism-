// backend/src/config/env.js
import dotenv from "dotenv";

dotenv.config(); // reads .env

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 5000;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

export const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jharkhand_tourism";

export const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
export const JWT_COOKIE_EXPIRE_DAYS = parseInt(
  process.env.JWT_COOKIE_EXPIRE || "30",
  10
);
