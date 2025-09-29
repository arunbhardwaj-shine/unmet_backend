import db from "../config/db.js";

export const publishQuestions = async (userId) => {
  const query = `
    SELECT 
      ibu_questions.id,
      user_id,
      users.name AS user_name,
      users.country,
      visibility_status,
      question,
      answer,
      ibu_questions.status,
      topics,
      ibu_questions.delete_status,
      ibu_questions.updated,
      ibu_questions.created
    FROM ibu_questions
    LEFT JOIN users ON ibu_questions.user_id = users.id
    WHERE ibu_questions.delete_status = 0
      AND ibu_questions.visibility_status = "Published"
      AND ibu_questions.user_id = ?
    ORDER BY ibu_questions.updated DESC
  `;

  const [rows] = await db.execute(query, [userId]);

  return rows.map(row => ({
    ...row,
    topics: row.topics ? JSON.parse(row.topics) : [],
  }));
};



export const AddIbuQuestionsModel = async (req) => {
  const { question = '' } = req.body;

  const query = `INSERT INTO ibu_questions (user_id, question) VALUES (?, ?)`;
  await db.execute(query, [req.authId, question]);

 return {};
};




