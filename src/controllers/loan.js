const db = require("../models");
const { sequelize } = require("../models");

const loanController = {
  addBook: async (req, res) => {
    console.log(req.params);
    const t = await sequelize.transaction();
    try {
      const checkCart = await db.cart.findOne({
        where: {
          user_id: req.user.id,
          book_id: req.params.book_id,
        },
      });
      if (!checkCart) {
        throw new Error("Not found book at cart");
      }
      const checkLoan = await db.loan.findOne({
        where: {
          user_id: req.user.id,
          book_id: req.params.book_id,
          return: 0,
        },
      });
      if (checkLoan) {
        throw new Error("The book has been borrowed and has not been returned");
      }
      await db.book.decrement(
        { stock: 1 },
        {
          where: {
            id: req.params.book_id,
          },
        }
      );

      await db.loan.create({
        user_id: req.user.id,
        book_id: req.params.book_id,
      });
      await db.cart.destroy({
        where: {
          user_id: req.user.id,
          book_id: req.params.book_id,
        },
      });
      console.log("ini lanjut");
      await t.commit();
      res.send();
    } catch (error) {
      console.log(error);
      await t.rollback();
      return res.status(400).json({
        message: error.toString(),
      });
    }
  },
  getLoans: async (req, res) => {
    console.log(req.params);
    const t = await sequelize.transaction();
    try {
      let result = {};
      if (req.user.admin) {
        result = await db.loan.findAll({
          attributes: ["id", "loan_time", "return"],
          where: {
            user_id: req.user.id,
          },
          include: [
            {
              model: db.book,
              include: {
                model: db.category,
                as: "categories",
                attributes: ["id", "category"],
                through: { attributes: [] },
              },
            },
            {
              model: db.user,
              attributes: ["id", "nim", "username"],
            },
          ],
        });
      } else {
        result = await db.loan.findAll({
          attributes: ["id", "loan_time", "return"],
          where: {
            user_id: req.user.id,
          },
          include: {
            model: db.book,
            include: {
              model: db.category,
              as: "categories",
              attributes: ["id", "category"],
              through: { attributes: [] },
            },
          },
        });
      }
      await t.commit();

      res.send(result);
    } catch (error) {
      console.log(error);
      await t.rollback();
      return res.status(400).json({
        message: error.toString(),
      });
    }
  },
};

module.exports = loanController;
