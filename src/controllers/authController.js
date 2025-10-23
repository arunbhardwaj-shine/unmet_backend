import { findUserByEmail, findUserById } from "../models/UserModel.js";
import { createLogs } from "../models/LoginLogsModel.js";
import { getUnmetUserById } from "../models/UnmetUsers.js";
import { fetchUserData, getUserEncryptedId } from "../helpers/commonHelper.js";
import { errorResponse, successResponse } from "../helpers/responseHelper.js";
import { getLocalIPs } from "../helpers/requestHelper.js";
import { encryptedToken } from "../utils/cryptoUtils.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { verifyRefreshToken } from "../middleware/authMiddelware.js";


export const checkToken = async (req, res, next) => {
  try{
    const { token, idToken } = req.body;
    const userData = await fetchUserData(token);
    if (!userData || !userData.mail) {
        return errorResponse(res, "something went wrong", 400, { error: "Invalid SSO credentials. Please try again."});
    }
    const getUserInfo = await findUserByEmail(userData.mail, ['id','name','email','group_id','login_type']);
    if (!getUserInfo) {
      return errorResponse(res, "something went wrong", 400, { error: "User not found."});
    }

    await createLogs({
      user_id: getUserInfo?.id || 0,
      platform: 2,
      email: userData.mail,
      ip_address: getLocalIPs(req),
      user_agent: req.headers["user-agent"],
      status: "success",
      access_token: token,
      id_token: idToken,
      payload: JSON.stringify(userData),
      login_time: new Date(),
    });

    const checkUnmetUser = await getUnmetUserById(getUserInfo?.id, ['id']);
    const getEncryptedUserId = await getUserEncryptedId(getUserInfo?.id, ['id']);
    let userRegistered = 0;
    if (checkUnmetUser) {
      userRegistered = 1;
    }
    
    const encrypted = await encryptedToken(getUserInfo?.id);
    let userObj = {
      email: userData.mail?.trim(),
      name: getUserInfo?.name.trim(),
      groupId: getUserInfo?.group_id,
      loginType: getUserInfo?.login_type,
      userToken: encrypted,
      type: "sso",
      ssoMail: userData.mail,
      encryptedId: getEncryptedUserId
    };

    let authToken = await generateAccessToken(userObj);
    let refreshToken = await generateRefreshToken(userObj);

    // Set refresh token in an httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    let payload = {
      userRegistered,
      jwtToken: authToken,
      userToken: encrypted,
      name:getUserInfo?.name.trim()
    }
      
    return successResponse(res, "Login successfull", payload);
  }catch(err){
    next(err); 
  }
};

export const refreshToken = async(req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return errorResponse(res, "something went wrong", 401, { error: "Refresh token not found."});

    let payload;
    try {
      payload = await verifyRefreshToken(token);
    } catch (err) {
      return errorResponse(res, "something went wrong", 403, { error: "Invalid or expired refresh token."});
    }

    let authToken;
    try {
      authToken = await generateAccessToken(payload?.userobj);
    } catch (err) {
      return errorResponse(res, "something went wrong", 500, { error: "Could not generate new access token."});
    }

    return successResponse(res, "Token updated successfully", { accessToken: authToken });
  }catch (err) {
    console.error("Refresh token error:", err);
    next(err);
  }
}

export const login = async (req, res, next) => {
  try{
    const { mail } = req.body;
    const getUserInfo = await findUserByEmail(mail, ['id','name','email','group_id','login_type']);
    if (!getUserInfo) {
      return errorResponse(res, "something went wrong", 400, { error: "User not found."});
    }

    const checkUnmetUser = await getUnmetUserById(getUserInfo?.id, ['id']);
    const getEncryptedUserId = await getUserEncryptedId(getUserInfo?.id, ['id']);
    let userRegistered = 0;
    if (checkUnmetUser) {
      userRegistered = 1;
    }
    const encrypted = await encryptedToken(getUserInfo?.id);
    let userObj = {
      email: mail?.trim(),
      name: getUserInfo?.name.trim(),
      groupId: getUserInfo?.group_id,
      loginType: getUserInfo?.login_type,
      userToken: encrypted,
      type: "sso",
      ssoMail: mail,
      encryptedId: getEncryptedUserId
    };

    let authToken = await generateAccessToken(userObj);
    let refreshToken = await generateRefreshToken(userObj);

    // Set refresh token in an httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    let payload = {
      userRegistered,
      jwtToken: authToken,
      userToken: encrypted,
      name:getUserInfo?.name.trim()
    }
    return successResponse(res, "Login successfull", payload);
  }catch(err){
    next(err);
  }
};

export const details = async(req, res, next) => {
  try{
    const { userId } = req.body;
    const getUserInfo = await findUserById(userId, ['users.name','profiles.first_name','profiles.last_name']);
    if (!getUserInfo) {
      return errorResponse(res, "something went wrong", 400, { error: "User not found."});
    }
    return successResponse(res, "Login successfull", getUserInfo);
  }catch(err){
    next(err);
  }
}