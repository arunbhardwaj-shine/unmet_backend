import { findUserByEmail } from "../models/UserModel.js";
import { createLogs } from "../models/LoginLogsModel.js";
import { getUnmetUserById } from "../models/UnmetUsers.js";
import { fetchUserData } from "../helpers/commonHelper.js";
import { errorResponse, successResponse } from "../helpers/responseHelper.js";
import { getLocalIPs } from "../helpers/requestHelper.js";
import { encryptedToken } from "../utils/cryptoUtils.js";
import { generateToken } from "../utils/token.js";


export const checkToken = async (req, res, next) => {
  try{
    const { token, idToken } = req.body;
    const userData = await fetchUserData(token);
    if (!userData || !userData.mail) {
        return errorResponse(res, "something went wrong", 400, { error: "Invalid SSO credentials. Please try again."});
    }
    const getUserInfo = await findUserByEmail(userData.mail, ['id','name','email','group_id','login_type']);
    if (getUserInfo.length === 0) {
      return errorResponse(res, "something went wrong", 400, { error: "User not found."});
    }

    // await createLogs({
    //   user_id: getUserInfo[0].id || 0,
    //   platform: 2,
    //   email: userData.mail,
    //   ip_address: getLocalIPs(req),
    //   user_agent: req.headers["user-agent"],
    //   status: "success",
    //   access_token: token,
    //   id_token: idToken,
    //   payload: JSON.stringify(userData),
    //   login_time: new Date(),
    // });

    const checkUnmetUser = await getUnmetUserById(getUserInfo?.id, ['id']);
    let userRegistered = 0;
    if (checkUnmetUser) {
      userRegistered = 1;
    }
    
    const encrypted = await encryptedToken(getUserInfo?.id);
    let createTokenObj = await generateToken({
        email: userData.mail?.trim(),
        name: getUserInfo?.name.trim(),
        groupId: getUserInfo?.group_id,
        loginType: getUserInfo?.login_type,
        userToken: encrypted,
        type: "sso",
        ssoMail: userData.mail
      });

    let payload = {
      userRegistered,
      jwtToken: createTokenObj,
      userToken: encrypted,
      name:getUserInfo?.name.trim()
    }
      
    return successResponse(res, "Login successfull", payload);
  }catch(err){
    next(err); 
  }
};
