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

export const getUsersProfileData = async (id,pdfids) => {
  const placeholders = pdfids.map(() => "?").join(",");
  const [rows] = await db.execute(
      `SELECT
    users.name,
    unmet.role,
    unmet.region,
    unmet.country,
    count(shared.id) as shared,
    count(stats.id) as share_content
FROM users
INNER JOIN unmet_users AS unmet
    ON unmet.user_id = users.id
INNER JOIN share_article AS shared
    ON shared.user_id = users.id
   AND shared.pdf_id IN (${placeholders})
INNER JOIN pdf_action_stats AS stats
    ON stats.user_id = users.id
   AND stats.action_status = 3
   AND stats.pdf_id IN (${placeholders})
WHERE users.group_id NOT IN (2,3)
AND users.id = ?
`,
      [...pdfids, ...pdfids,id]
    );
    return rows;
};
