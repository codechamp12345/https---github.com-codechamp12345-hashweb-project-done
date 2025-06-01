import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (id, res) => {
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Reduced from 21d to 7d for better security
  });

  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: isProduction, // Must be true in production
    sameSite: isProduction ? 'none' : 'lax', // Must be 'none' in production for cross-domain
    path: "/",
    domain: isProduction ? '.onrender.com' : undefined // Allow cookies on subdomains
  });

  return token;
};
