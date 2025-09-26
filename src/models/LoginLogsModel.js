import db from "../config/db.js";

export const createLogs = async (logData) => {
    const [result] = await db.execute("INSERT INTO login_logs SET ?", logData);
    return result;
}