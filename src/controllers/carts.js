const db = require("../models");
const { sequelize } = require("../models");

const cartController = {
  addBook: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const book = await db.book.findOne({
        where: {
          id: req.params.book_id,
          stock: 0,
        },
      });
      if (book) {
        throw new Error("No Stock");
      }
      await db.cart.create({
        user_id: req.user.id,
        book_id: req.params.book_id,
      });
      await t.commit();
      res.status(200).json();
    } catch (error) {
      console.log(error);
      await t.rollback();
      if (error.parent?.code === "ER_DUP_ENTRY") {
        // status code 409
        return res.status(400).json({
          message: "The book is already in the cart",
        });
      } else {
        return res.status(400).json({
          message: error.message.toString(),
        });
      }
    }
  },
  deleteBook: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      await db.cart.destroy({
        where: {
          user_id: req.user.id,
          book_id: req.params.book_id,
        },
      });
      await t.commit();
      res.status(200).json();
    } catch (error) {
      console.log(error);
      await t.rollback();
      return res.status(400).json({
        message: error,
      });
    }
  },
};

module.exports = cartController;
