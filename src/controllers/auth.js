const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {Op} = require("sequelize");
const {sequelize} = require("../models");
const fs = require("fs");
const { getMaxListeners } = require("process");
const mailer = require("../lib/mailer");
const mustache = require("mustache");

const User = db.user;

const secret = "qaqa";
const authController = {
  login: async (req, res) => {
    console.log(req.body);
    const { nim, password } = req.body;
    const t = await db.sequelize.transaction();
    try {
      const result = await User.findOne({
        where: {
          nim: nim,
          password: password,
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
        message: error,
      });
    }
  },


  register: async (req, res) => {
    const t = await sequelize.transaction();

    const { email, password, username, nim } = req.body;

    try {
      const ifUserExist = await User.findOne({
        where: {
          [Op.or]: [
            {
              email: email,
            },

            {
              username: username
            },
          ],
        },
      });      
      if  (ifUserExist) {
        throw new Error(
         "this email already registered",
        );
      }
      const hpassword = bcrypt.hashSync(password,10);
      const data = {
        nim,
        username,
        email,
        password : hpassword,
        verified : false,
      }

      const result =  await User.create({...req.body});
      delete result.dataValues.password;

      await t.commit;

      const token  = await jwt.sign({
        ...result.dataValues
      },
      process.env.secret,
      {
        expiresIn : "5m"
      }
      );

    const template = fs
      .readFileSync(__dirname + "/../templates/verify.html")
      .toString();

    const renderedTemplate = mustache.render(template, {
      username,
      verify_url: process.env.verificationLink + token,
      full_name: nim,
    });

    mailer({
      to: email,
      subject: "Verify your account!",
      html: renderedTemplate,
    });
      
      return res.status(201).json({
        message: "new user registered",
        result: result,
      });
    } catch (err) {
      await t.rollback();

      console.log(err);
      res.status(400).json({
        message: err.toString(),
      });
    }
  },

  verifiedUser: async (req, res) => {
    try {
      const token = req.params.token;
      const data = await jwt.verify(token, secret);
      console.log(data);
      await User.update (
        {
          verified : true,
        },
        {
          where : {
            id: data.id,
          },
        }
      );
      return res.status(400).json({
        message: "Verified"
      });
    }
    catch (err) {
      return res.status(400).json({
        message: err.toString(),
      });
    }
  },
  resendEmail: async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const user = await User.findByPk(id);
    const template = fs
    .readFileSync(__dirname + "/../templates/verify.html")
    .toString();

    const token = await jwt.sign({id}, process.env.secret, {
      expiresIn: "3m"
    });

    const renderedTemplate = mustache.render(template, {
      username : user.dataValues.username,
      verify_url : process.env.verificationLink + token,
      full_name: user.dataValues.name,
    });

    await mailer({
      to: user.dataValues.email,
      subject: "verify Your Account",
      html: renderedTemplate,
    });
    res.send("email Sent")
  },


};
module.exports = authController;
