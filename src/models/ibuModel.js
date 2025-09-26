import db from "../config/db.js";

export const publishQuestions = async (userId) => {
    if (!userId) {
        throw new Error("User ID not provided");
    }

    const [result] = await db.execute(
        `SELECT ibu_questions.id, user_id, users.name AS user_name, users.country,
            visibility_status, question, answer, ibu_questions.status, topics,
            ibu_questions.delete_status, ibu_questions.updated, ibu_questions.created
     FROM ibu_questions
     LEFT JOIN users ON ibu_questions.user_id = users.id
     WHERE ibu_questions.delete_status = 0
       AND ibu_questions.visibility_status = "Published"
       AND ibu_questions.user_id = ?
     ORDER BY ibu_questions.updated DESC`,
        [userId]
    );

    const questions = result.map((row) => ({
        ...row,
        topics: row.topics ? JSON.parse(row.topics) : [],
    }));

    return questions;
};


export const AddIbuQuestionsModel = async (req) => {
    const { userId = '', question = '' } = req.body;

    if (!userId) {
        throw new Error('userId is required');
    }

    if (!question) {
        throw new Error('question is required');
    }

    const query = `INSERT INTO ibu_questions (user_id, question) VALUES (?, ?)`;
    await db.execute(query, [userId, question]);

    return {
        message: 'Question added successfully',
        data: {},
    };
};





