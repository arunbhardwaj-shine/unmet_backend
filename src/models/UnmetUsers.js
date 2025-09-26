import db from "../config/db.js";

// export const insertUser = async (logData) => {
//     const [result] = await db.executeQuery("INSERT INTO login_logs SET ?", logData);
//     return result;
// }

// export const getUserById = async (id) => {
//     const [result] = await db.executeQuery("INSERT INTO login_logs SET ?", logData);
//     return result;
// }

export const getUnmetUserById = async (id, fields = ['*']) => {
  const columns = Array.isArray(fields) && fields.length ? fields.join(', ') : '*';

  const [rows] = await db.execute(`SELECT ${columns} FROM unmet_users WHERE user_id = ? `, [id]);
  return rows[0] || null;
};