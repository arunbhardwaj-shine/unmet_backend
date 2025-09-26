import db from "../config/db.js";

export const createLogs = async (logData) => {
    const [result] = await db.executeQuery("INSERT INTO login_logs SET ?", logData);
    return result;
}