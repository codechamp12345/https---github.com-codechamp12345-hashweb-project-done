import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (id, res) => {
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "21d",
  });

  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie("jwt", token, {
    maxAge: 21 * 24 * 60 * 60 * 1000, // 21 days
    httpOnly: true,
    secure: isProduction, // Only use secure in production
    sameSite: isProduction ? 'none' : 'lax', // Use 'none' in production for cross-site cookies
    path: "/",
    domain: isProduction ? process.env.COOKIE_DOMAIN : undefined // Set domain in production
  });

  return token;
};
