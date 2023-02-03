const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {Op} = require("sequelize")
const {sequelize} = require("../models")
const User = db.user;
const secret = "qaqa"
const authController = {
  login: async (req, res) => {
    console.log(req.body);
    const { nim, password } = req.body;
    const t = await db.sequelize.transaction();
    try {
      const result = await User.findOne({
        where: {
          nim: nim,
          password : password,
        },
      });

      const token = jwt.sign({ ...result.dataValues }, secret, {
        expiresIn: "1h",
      });
      await t.commit();
      console.log("result");
      console.log(result);
      res.status(200).json({
        token: token,
        user: {
          username: result.username,
          admin: result.admin,
        },
      });
    } catch (error) {
      await t.rollback();
      res.status(400).json({
        message: err,
      });
    }
  },
  register: async (req, res) => {
    const t =  await sequelize.transaction();

    try {
      const ifUserExist = await User.findOne({
        where: {
          [Op.or]: [
            {
              email: req.body.email,
            },

            {
              username: req.body.username
            },
          ],
        },
      });
      
      if  (ifUserExist) {
        throw new Error({
          message: "this email already registered",
        });
      }
      const result =  await User.create({...req.body});
      await t.commit;

      return res.status(201).json({
        message: "new user registered",
        result: result,
      });
    }
    catch(err) {
      await t.rollback();

      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  }
};
module.exports = authController;