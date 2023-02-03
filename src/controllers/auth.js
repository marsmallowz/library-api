const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = db.user;

const authController = {
  login: async (req, res) => {
    console.log(req.body);
    const { nim, password } = req.body;
    const t = await db.sequelize.transaction();
    try {
      const result = await User.findOne({
        where: {
          nim: nim,
        },
      });
      const isValid = await bcrypt.compare(password, result.password);
      if (!isValid) {
        res.status(400).json({
          message: err,
        });
      }

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
};
module.exports = authController;
