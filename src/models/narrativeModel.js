import db from "../config/db.js";

export const getNarrativeCategoriesAndAgeGroups = async () => {

  const categoryQuery = `SELECT * FROM narratives_categories where id != 1`;
  const ageGroupQuery = `SELECT * FROM narratives_age_groups  where id != 1`;
  const TopicsQuery   = `SELECT Distinct product FROM spc_products  where type = 2 and created_by = ${process.env.OWNER_ID}`;

  const [[categoryRows], [ageGroupRows], [accountTags]] = await Promise.all([
    db.execute(categoryQuery),
    db.execute(ageGroupQuery),
    db.execute(TopicsQuery),
  ]);
  return { categories: categoryRows, ageGroups: ageGroupRows, tags: accountTags };
};

export const getNarrativeDataResult = async () => {
  const [narrative] = await db.execute(`SELECT * FROM narratives`);
  return narrative;
};
