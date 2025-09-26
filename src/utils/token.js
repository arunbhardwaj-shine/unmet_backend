import jwt from "jsonwebtoken";

export const generateToken = async(userobj) => {
  return jwt.sign(
    userobj,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE_TIME }
  );
};

