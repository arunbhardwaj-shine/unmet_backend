import db from "../config/db.js";

export const createLogs = async (logData) => {
    try {
        Object.keys(logData).forEach(k => {
        if (logData[k] === undefined) logData[k] = null;
        });

        const sql = `
        INSERT INTO login_logs
        (user_id, platform, email, ip_address, user_agent, status, access_token, id_token, payload, login_time)
        VALUES (:user_id, :platform, :email, :ip_address, :user_agent, :status, :access_token, :id_token, :payload, :login_time)
        `;

        const [result] = await db.execute(sql, logData);
        console.log(" Log inserted successfully:", result.insertId);
        return result;
    } catch (error) {
        console.error(" Error inserting log:", error.message);
        console.error(" SQL Error Stack:", error.stack);
        throw error;
    }
}