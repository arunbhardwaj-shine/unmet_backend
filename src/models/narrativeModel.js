import db from "../config/db.js";

export const getNarrativeCategoriesAndAgeGroups = async () => {
  const contentCategory = ["Collection", "E-Learning", "FAQ", "Flyer", "Form", "Posters", "Publications", "Slide Deck", "Videos", "Websites"];
  const categoryQuery = `SELECT * FROM narratives_categories where id != 1`;
  const ageGroupQuery = `SELECT * FROM narratives_age_groups  where id != 1`;

  const [[categoryRows], [ageGroupRows]] = await Promise.all([
    db.execute(categoryQuery),
    db.execute(ageGroupQuery),
  ]);
  return { categories: categoryRows, ageGroups: ageGroupRows, contentCategory: contentCategory };
};

export const getNarrativeDataResult = async () => {
  const [narrative] = await db.execute(`SELECT * FROM narratives`);
  return narrative;
};
