import db from "../config/db.js";

export const addRatingInfo = async(insertObj) => {
    const keys = Object.keys(insertObj);
    const values = Object.values(insertObj);

    const columns = keys.join(", ");
    const placeholders = keys.map(() => "?").join(", ");

    const sqlInsert = `INSERT INTO pdf_action_stats (${columns}) VALUES (${placeholders})`;
    const [insertResult] = await db.query(sqlInsert, values);

    const sqlCount = `
      SELECT COUNT(*) AS total_ratings 
      FROM pdf_action_stats 
      WHERE pdf_id = ? AND action_status = 4
    `;
    const [rows] = await db.query(sqlCount, [insertObj.pdf_id]);
    return {
        total_ratings: rows[0].total_ratings
    }
}