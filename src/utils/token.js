import jwt from "jsonwebtoken";

export const generateAccessToken = async(userobj) => {
  return jwt.sign(
    userobj,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE_TIME }
  );

};

export const generateRefreshToken = async(userobj) => {
  return jwt.sign({ userobj }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFREST_EXPIRE_TIME });
};

