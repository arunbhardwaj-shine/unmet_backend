import db from "../config/db.js";

export const createUser = async (user) => {
  const { name, email, password } = user;
  const [result] = await db.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );
  return result;
};

export const findUserByEmail = async (email, fields = ['*']) => {
  const columns = Array.isArray(fields) && fields.length ? fields.join(', ') : '*';

  const [rows] = await db.execute(
    `SELECT ${columns} FROM users WHERE group_id NOT IN (2,3) and email LIKE ?`,
    [`%${email}%`]
  );

  return rows[0] || null;
};