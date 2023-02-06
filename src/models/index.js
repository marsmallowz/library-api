"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = require("./user")(sequelize, Sequelize);
db.book = require("./book")(sequelize, Sequelize);
db.cart = require("./cart")(sequelize, Sequelize);
db.category = require("./category")(sequelize, Sequelize);
db.booksCategories = require("./books-categories")(sequelize, Sequelize);
db.loan = require("./loan")(sequelize, Sequelize);

db.user.belongsToMany(db.book, {
  through: db.cart,
  as: "carts",
  foreignKey: "user_id",
});

db.book.belongsToMany(db.user, {
  through: db.cart,
  foreignKey: "book_id",
});

db.book.belongsToMany(db.category, {
  through: db.booksCategories,
  as: "categories",
  foreignKey: "book_id",
});

db.category.belongsToMany(db.book, {
  through: db.booksCategories,
  foreignKey: "category_id",
});

db.user.hasMany(db.loan, { foreignKey: "user_id" });
db.loan.belongsTo(db.user, { foreignKey: "user_id" });

db.book.hasMany(db.loan, { foreignKey: "book_id" });
db.loan.belongsTo(db.book, { foreignKey: "book_id" });

module.exports = db;
