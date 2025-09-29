import db from "../config/db.js";

export const getArticleContent = async () => {
    const [result] = await db.execute(`Select pdfs.id,pdfs.title,pdfs.pdf_sub_title,pdfs.category,pdfs.tags,
        DATE_FORMAT(pdfs.creation_date, "%d.%M.%Y") as creation_date,
        pdfs.age_groups,0 as rating,
        case
        when pdfs.spc_included =1 THEN  concat("${process.env.DOCINTEL_LINK}","libraries/article_preview/",pdfs.id )
                ELSE   concat("${process.env.DOCINTEL_LINK}", pdfs.folder_name ,"/", pdfs.code, "_","JUFCJTEzJUNEWSVBNCVEOCVEREQ=")
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
        from pdfs where uploaded_by = ? and delete_status = 0 and draft = 0`,
         [process.env.OWNER_ID]);
    return result;
}