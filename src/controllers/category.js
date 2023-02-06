const db = require("../models");
const { Sequelize, sequelize, category } = require("../models");

const categoryController = {
  getCategories: async (req, res) => {
    console.log(req.body);
    const t = await sequelize.transaction();
    try {
      console.log("hahhahah");
      const result = await db.category.findAll();
      await t.commit();
      res.send(result);
    } catch (error) {
      await t.rollback();
      console.log(error);
      return res.status(400).json({
        message: error.message.toString(),
      });
    }
  },

  createCategory: async (req, res) => {
    console.log(req.body);
    const t = await sequelize.transaction();
    try {
      console.log("hahhahah");
      console.log(req.user);
      if (!req.user.admin) {
        throw new Error("Not admin");
      }
      if (!req.body.category) {
        throw new Error("Please insert category");
      }
      const result = db.category.create({
        category: req.body.category,
      });
      await t.commit();
      res.send(result);
    } catch (error) {
      await t.rollback();
      console.log(error);
      return res.status(400).json({
        message: error.message.toString(),
      });
    }
  },
  updateCategory: async (req, res) => {
    console.log(req.body);
    const t = await sequelize.transaction();
    try {
      if (!req.user.admin) {
        throw new Error("Not admin");
      }
      const result = db.category.update(
        {
          category: req.body.category,
        },
        {
          where: {
            id: req.params.category_id,
          },
        }
      );
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
  deleteCategory: async (req, res) => {
    console.log(req.body);
    const t = await sequelize.transaction();
    try {
      if (!req.user.admin) {
        throw new Error("Not admin");
      }
      const result = db.category.destroy({
        where: {
          id: req.params.category_id,
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

module.exports = categoryController;
