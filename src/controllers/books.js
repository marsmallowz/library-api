const db = require("../models");
const { Sequelize, sequelize } = require("../models");

const bookController = {
  getBooks: async (req, res) => {
    const t = await sequelize.transaction();
    const { page, size, sort } = req.query;
    const data = { page: page ?? 1, size: size ?? 8, sort: sort ?? "ASC" };
    data.page = 1 - data.page;
    try {
      let sperated = "";
      let books = {};
      if (req.body.categories) {
        const categories = req.body.categories;
        categories.forEach((val, index) => {
          if (index !== 0) {
            sperated += `, ${val.id}`;
          } else {
            sperated += `${val.id}`;
          }
        });
        books = await sequelize.query(
          `
          SELECT book_id as id, books.tittle 
          FROM(SELECT book_id, COUNT(DISTINCT category_id ) as jumlah FROM books_categories where category_id IN(${sperated}) group by book_id ) as list_book 
          JOIN books on book_id = books.id order by books.tittle ${data.sort} limit ${data.size} offset ${data.page};`,
          { type: Sequelize.QueryTypes.SELECT }
        );
      } else {
        books = await sequelize.query(
          `
          SELECT book_id as id, books.tittle 
          FROM(SELECT book_id, COUNT(DISTINCT category_id ) as jumlah FROM books_categories where category_id group by book_id ) as list_book 
          JOIN books on book_id = books.id order by books.tittle ${data.sort} limit ${data.size} offset ${data.page};
          `,
          { type: Sequelize.QueryTypes.SELECT }
        );
      }

      console.log("books");
      console.log(books);
      const bookIdList = await books.map((val) => val.id);
      console.log("bookIdList");
      console.log(bookIdList);
      const result = await db.book.findAll({
        where: {
          id: bookIdList,
        },
        include: {
          model: db.category,
          as: "categories",
          attributes: ["id", "category"],
          through: { attributes: [] },
        },
      });

      console.log("result");
      console.log(result);
      await t.commit();
      res.send(result);
    } catch (error) {
      console.log(error);
      await t.rollback();
      res.status(400).json({
        message: error,
      });
    }
  },
  bookDetails: async (req, res) => {
    console.log(req.params);
    const t = await sequelize.transaction();
    try {
      const result = await db.book.findOne({
        where: {
          id: req.params.book_id,
        },
        include: {
          model: db.category,
          as: "categories",
          attributes: ["id", "category"],
          through: { attributes: [] },
        },
      });
      await t.commit();
      console.log(result);
      res.send(result);
    } catch (error) {
      console.log(error);
      await t.rollback();
      res.status(400).json({
        message: error,
      });
    }
  },
};

module.exports = bookController;

// `SELECT book_id as id, books.tittle FROM(SELECT book_id, COUNT(DISTINCT category_id ) as jumlah FROM books_categories where category_id IN(${sperated}) group by book_id having jumlah = 2) as list_book JOIN books on book_id = books.id;`,
