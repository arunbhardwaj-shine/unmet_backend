import db from "../config/db.js";

export const getArticleContent = async (req) => {
    const user_id = req?.authId;
    const encryptedId = req?.encryptedId;
    const [result] = await db.execute(`Select pdfs.id,pdfs.title,pdfs.pdf_sub_title,pdfs.category,pdfs.tags,pdfs.file_type,pdfs.folder_name,
        pdfs.sold_unsold as hide_in_hcp,pdfs.allow_share as share,pdfs.allow_download as download,
        pdfs.created as created_date,
        DATE_FORMAT(pdfs.creation_date, "%d.%M.%Y") as creation_date,
        pdfs.age_groups,
        pdfs.diagnosis,
        COUNT(DISTINCT pdf_action.id) AS rating,
        CASE
            WHEN COUNT(DISTINCT user_rate.id) > 0 THEN 1
            ELSE 0
        END AS self_rate,
        CASE
            WHEN pdfs.file_type IN ('pdf','video','iframe') THEN pdfs.pdf_file
            WHEN pdfs.file_type = 'ebook' THEN
            GROUP_CONCAT(DISTINCT pdf_files.file_name ORDER BY pdf_files.id SEPARATOR ',')
        END AS pdf_files,
        case
        when pdfs.spc_included =1 THEN  concat("${process.env.DOCINTEL_LINK}","libraries/article_preview/",pdfs.id )
                ELSE   concat("${process.env.DOCINTEL_LINK}", pdfs.folder_name ,"/", pdfs.code, "_","${encryptedId}")
                END as previewArticle,
        IF(
            pdfs.uploaded_by = 2147541300,
            CASE
                WHEN pdfs.category = 'Event' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Event.png'
                WHEN pdfs.category = 'Expert Video' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Expert_video.png'
                WHEN pdfs.category = 'FAQ' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/FAQ.png'
                WHEN pdfs.category = 'Flyer' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Flyer.png'
                WHEN pdfs.category = 'Manuscript' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Manusecript.png'
                WHEN pdfs.category = 'Posters' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Posters.png'
                WHEN pdfs.category = 'Publications' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/publications.png'
                WHEN pdfs.category = 'Services' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Service.png'
                WHEN pdfs.category = 'Slide Deck' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Slide_Deck.png'
                WHEN pdfs.category = 'Symposia' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Symposia.png'
                WHEN pdfs.category = 'Videos' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Video.png'
                WHEN pdfs.category = 'Websites' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Website.png'
                ELSE 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Posters.png'
            END,
            'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Posters.png'
        ) AS category_icon
        from pdfs
        LEFT JOIN pdf_action_stats AS pdf_action ON pdf_action.pdf_id = pdfs.id AND pdf_action.action_status = 4
        LEFT JOIN pdf_action_stats AS user_rate ON user_rate.pdf_id = pdfs.id AND user_rate.action_status = 4
        AND user_rate.user_id = ?
        LEFT JOIN pdf_files ON pdf_files.pdf_id = pdfs.id
        where uploaded_by = ? and delete_status = 0 and draft = 0 and pdfs.folder_name != "video" GROUP BY pdfs.id order by creation_date Desc`,
         [user_id, process.env.OWNER_ID]);
    return result;
}

export const getPdfs = async (req) => {
    const [result] = await db.execute(`Select id from pdfs
        where uploaded_by = ? and delete_status = 0 and draft = 0 and pdfs.folder_name != "video" GROUP BY pdfs.id`,
         [process.env.OWNER_ID]);
    const pdfids = result?.length > 0 ? result.map((item) => item.id) : [99999999];
    return pdfids;
}

export const getRecentViewContent = async (req) => {
  const encryptedId = req?.encryptedId;
  const userId = req?.authId;
  const ownerId = process.env.OWNER_ID;

  const [recentViews] = await db.execute(
    `SELECT sp.pdf_id FROM static_pdfs sp
    INNER JOIN (SELECT pdf_id, MAX(id) AS max_id FROM static_pdfs
      WHERE user_id = ? GROUP BY pdf_id
    ) latest ON sp.pdf_id = latest.pdf_id AND sp.id = latest.max_id
    INNER JOIN pdfs p ON p.id = sp.pdf_id WHERE sp.user_id = ? ORDER BY sp.id DESC`,
    [userId,userId]
  );

  if (recentViews.length === 0) return [];

  const pdfIds = recentViews.map((r) => r.pdf_id);
  const placeholders = pdfIds.map(() => "?").join(",");

  const [pdfData] = await db.execute(
    `SELECT
        pdfs.id,
        pdfs.title,
        pdfs.pdf_sub_title,
        pdfs.category,
        pdfs.tags,
        pdfs.file_type,
        pdfs.folder_name,
        pdfs.sold_unsold AS hide_in_hcp,
        pdfs.allow_share AS share,
        pdfs.allow_download AS download,
        pdfs.created AS created_date,
        DATE_FORMAT(pdfs.creation_date, "%d.%M.%Y") AS creation_date,
        pdfs.age_groups,
        pdfs.diagnosis,
        COUNT(DISTINCT pdf_action.id) AS rating,
        CASE WHEN COUNT(DISTINCT user_rate.id) > 0 THEN 1 ELSE 0 END AS self_rate,
        CASE
            WHEN pdfs.file_type IN ('pdf','video','iframe') THEN pdfs.pdf_file
            WHEN pdfs.file_type = 'ebook' THEN
                GROUP_CONCAT(DISTINCT pdf_files.file_name ORDER BY pdf_files.id SEPARATOR ',')
        END AS pdf_files,
        CASE
            WHEN pdfs.spc_included = 1 THEN CONCAT(?, "libraries/article_preview/", pdfs.id)
            ELSE CONCAT(?, pdfs.folder_name, "/", pdfs.code, "_", ?)
        END AS previewArticle,
        IF(
            pdfs.uploaded_by = 2147541300,
            CASE
                WHEN pdfs.category = 'Event' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Event.png'
                WHEN pdfs.category = 'Expert Video' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Expert_video.png'
                WHEN pdfs.category = 'FAQ' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/FAQ.png'
                WHEN pdfs.category = 'Flyer' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Flyer.png'
                WHEN pdfs.category = 'Manuscript' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Manusecript.png'
                WHEN pdfs.category = 'Posters' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Posters.png'
                WHEN pdfs.category = 'Publications' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/publications.png'
                WHEN pdfs.category = 'Services' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Service.png'
                WHEN pdfs.category = 'Slide Deck' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Slide_Deck.png'
                WHEN pdfs.category = 'Symposia' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Symposia.png'
                WHEN pdfs.category = 'Videos' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Video.png'
                WHEN pdfs.category = 'Websites' THEN 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Website.png'
                ELSE 'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Posters.png'
            END,
            'https://docintel.s3-eu-west-1.amazonaws.com/cover/wilprophy/Posters.png'
        ) AS category_icon
    FROM pdfs
    LEFT JOIN pdf_action_stats AS pdf_action
      ON pdf_action.pdf_id = pdfs.id AND pdf_action.action_status = 4
    LEFT JOIN pdf_action_stats AS user_rate
      ON user_rate.pdf_id = pdfs.id AND user_rate.action_status = 4 AND user_rate.user_id = ?
    LEFT JOIN pdf_files
      ON pdf_files.pdf_id = pdfs.id
    WHERE
      pdfs.uploaded_by = ?
      AND pdfs.id IN (${placeholders})
      AND pdfs.delete_status = 0
      AND pdfs.draft = 0
      AND pdfs.folder_name != "video"
    GROUP BY pdfs.id
    ORDER BY FIELD(pdfs.id, ${placeholders});
    `,
    [
      process.env.DOCINTEL_LINK,
      process.env.DOCINTEL_LINK,
      encryptedId,
      userId,
      ownerId,
      ...pdfIds,
      ...pdfIds,
    ]
  );
  return pdfData;
};
