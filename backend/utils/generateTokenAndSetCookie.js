import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (id, res) => {
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "21d",
  });

  res.cookie("jwt", token, {
    maxAge: 21 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax", // Use lax for development
    secure: process.env.NODE_ENV === 'production', // Only use secure in production
    path: "/",
  });

  return token;
};
