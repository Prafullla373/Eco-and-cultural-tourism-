// backend/src/utils/generateJWT.js
import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_COOKIE_EXPIRE_DAYS,
  NODE_ENV,
} from "../config/env.js";

export const generateTokenAndSetCookie = (userId, role, res) => {
  const token = jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: `${JWT_COOKIE_EXPIRE_DAYS}d`,
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    path: "/", // Explicit path
    maxAge: JWT_COOKIE_EXPIRE_DAYS * 24 * 60 * 60 * 1000,
  });

  return token;
};
