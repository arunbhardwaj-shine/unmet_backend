import db from "../config/db.js";

export const createUnmetUser = async (logData) => {
    const [result] = await db.execute("INSERT INTO unmet_users (user_id, role, region, country) VALUES (?, ?, ?, ?)",
      [logData?.user_id,logData?.role,logData?.region,logData?.country]);
    return result;
}

export const getUnmetUserById = async (id, fields = ['*']) => {
  const columns = Array.isArray(fields) && fields.length ? fields.join(', ') : '*';

  const [rows] = await db.execute(`SELECT ${columns} FROM unmet_users WHERE user_id = ? `, [id]);
  return rows[0] || null;
};