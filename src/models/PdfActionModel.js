import db from "../config/db.js";

export const checkRating = async(pdf_id, user_id) => {
  const [result] = await db.execute(`Select count(id) as total from pdf_action_stats where pdf_id = ? and user_id = ? and action_status = 4 group by pdf_id`,[pdf_id,user_id]);
  return result[0] || 0;
}

export const addPdfActionInfo = async(insertObj) => {
    const keys = Object.keys(insertObj);
    const values = Object.values(insertObj);

    const columns = keys.join(", ");
    const placeholders = keys.map(() => "?").join(", ");

    const sqlInsert = `INSERT INTO pdf_action_stats (${columns}) VALUES (${placeholders})`;
    const [insertResult] = await db.query(sqlInsert, values);

    return await getRatingForArticle(insertObj.pdf_id, insertObj?.action_status)
}

export const deleteRating = async (pdf_id, user_id) => {
  const [result] = await db.execute(
    `DELETE FROM pdf_action_stats
     WHERE pdf_id = ?
       AND user_id = ?
       AND action_status = 4`,
    [pdf_id, user_id]
  );

  return await getRatingForArticle(pdf_id, 4);
};

const getRatingForArticle = async(pdf_id, status) => {
  const sqlCount = `
      SELECT COUNT(*) AS total_ratings
      FROM pdf_action_stats
      WHERE pdf_id = ? AND action_status = ?
    `;
  const [rows] = await db.query(sqlCount, [pdf_id, status]);
  return {
        total_ratings: rows[0].total_ratings
    }
}