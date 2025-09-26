
import jwt from "jsonwebtoken";
import { decryptedToken } from "../utils/cryptoUtils.js";
import { errorResponse } from "../helpers/responseHelper.js";

export const authenticateToken = async(req, res, next) => {
  try {
    const token = req.headers['auth']?.split(' ')[1];
    if (!token) {
      return errorResponse(res, "something went wrong", 401, { error: "Unauthorized user access"});
    }
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return reject(err);
        resolve(user);
      });
    });

    const userId = await decryptedToken(decoded?.userToken);
    req.name = decoded?.name;
    req.email = decoded?.email;
    req.authId = userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};