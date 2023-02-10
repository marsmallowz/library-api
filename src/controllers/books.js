const db = require("../models");
const { Sequelize, sequelize, book } = require("../models");
const fs = require("fs");
const filePath = "src/public/book/";

const bookController = {
  getBooks: async (req, res) => {
    const t = await sequelize.transaction();
    const { page, size, sort } = req.query;
    const data = { page: page ?? 1, size: size ?? 8, sort: sort ?? "ASC" };
    console.log(data);

    data.page = data.page - 1;
    console.log("mydata page");
    console.log(data);
    try {
      let sperated = "";
      let books = {};
      console.log("req.body.categories");
      console.log(req.body.categories);
      if (req.body.categories.length) {
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
          FROM(SELECT book_id, COUNT(DISTINCT category_id ) as jumlah FROM books_categories where category_id IN(${sperated}) group by book_id having jumlah = ${categories.length} ) as list_book 
          JOIN books on book_id = books.id order by books.tittle ${data.sort} limit ${data.size} offset ${data.page};`,
          { type: Sequelize.QueryTypes.SELECT }
        );
      } else {
        books = await sequelize.query(
          `
          SELECT id, tittle  
          FROM books order by tittle ${data.sort} limit ${data.size} offset ${data.page};
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
        order: [["tittle", data.sort]],
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
  createBook: async (req, res) => {
    console.log(req.body);
    try {
      const image_url = process.env.render_image + req.file.filename;
      const { tittle, author, synopsis } = req.body;
      const data = { tittle, author, synopsis, image_url, stock: 0 };

      console.log(req.body);
      const result = await db.book.create({ ...data });

      return res.status(200).json({
        result,
        message: "New Book Created Successfully",
      });
    } catch (err) {
      return res.status(400).json({
        message: err.toString(),
      });
    }
  },

  createBook2: async (req, res) => {
    console.log(req.body);
    const id = req.params.id;
    let pic = await sharp(req.file.buffer).resize(250, 250).png().toBuffer();
    await book.update(
      {
        avatar_buffer: pic,
        avatar_url: process.env.render_avatar + id,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.send("test");
  },
  updateBook: async (req, res) => {
    console.log("req data");
    // console.log(req);
    console.log(req.body);
    try {
      if (!req.user.admin) {
        throw new Error("Not Admin");
      }
      const id = req.params.book_id;
      const { tittle, author, synopsis, stock } = req.body;
      const data = { tittle, author, synopsis, stock };
      console.log(data);
      
      if (req.file) {
        const id = await db.book.findOne({
          where : {
            id : req.params.book_id,
          },
        });
        console.log("result");
        const image = id.dataValues.image_url.split("http://localhost:2000/post_image/");

        fs.unlink(filePath + image[1], function (err) {
          if (err && err.code !== "ENOENT") {
            throw new Error("Books Doesnt Exist")
          }
          else if (err) {
            throw new Error (err)
          }
          else {
            console.log("Books Removed")
          }
        } );

        data.image_url = process.env.render_image + req.file.filename;

      }

      await book.update(

        {
          ...data,
        },
        {
          where: {
            id,
          },
        }
      );
      const result = await book.findByPk(id);

      return res.status(200).json({
        message: "Book updated successfully",
        result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.toString(),
      });
    }
  },

  deleteBook: async (req, res) => {
    console.log(req.body);
    const t = await sequelize.transaction();

    try {
      if (!req.user.admin) {
        throw new Error("Not Admin");
      }

      const id = await db.book.findOne({
        where: {
          id: req.params.book_id,
        },
      });
      console.log("id");
      console.log(
        id.dataValues.image_url.split("http://localhost:2000/post_image/")
      );
      const image = id.dataValues.image_url.split(
        "http://localhost:2000/post_image/"
      );

      fs.unlink(filePath + image[1], function (err) {
        if (err && err.code !== "ENOENT") {
          throw new Error("Books Doesnt Exist, Won't remove it");
        } else if (err) {
          throw new Error(err);
        } else {
          console.log("Books Removed");
        }
      });

      const result = db.book.destroy({
        where: {
          id: req.params.book_id,
        },
      });

      await t.commit();
      res.send(result);
    } catch (error) {
      await t.rollback();
      console.log(error);
      return res.status(400).json({
        message: error.toString(),
      });
    }
  },
};

module.exports = bookController;

// `SELECT book_id as id, books.tittle FROM(SELECT book_id, COUNT(DISTINCT category_id ) as jumlah FROM books_categories where category_id IN(${sperated}) group by book_id having jumlah = 2) as list_book JOIN books on book_id = books.id;`,

// `
// SELECT book_id as id, books.tittle
// FROM(SELECT book_id, COUNT(DISTINCT category_id ) as jumlah FROM books_categories group by book_id ) as list_book
// JOIN books on book_id = books.id order by books.tittle ${data.sort} limit ${data.size} offset ${data.page};
// `,
