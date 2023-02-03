const db = require("../models");

const cartController = {
  addBook: async (req, res) => {
    console.log(req.params);
    const t = await sequelize.transaction();
    try {
      await db.cart.create({
        user_id: req.user.id,
        book_id: req.params.book_id,
      });
      await t.commit();
      res.status(200).json();
    } catch (error) {
      await t.rollback();
      return res.status(400).json({
        message: err,
      });
    }
  },
  deleteBook: async (req, res) => {
    console.log(req.params);
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
      await t.rollback();
      return res.status(400).json({
        message: err,
      });
    }
  },
};

module.exports = cartController;
