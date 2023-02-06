"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class loan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  loan.init(
    {
      loan_time: {
        type: DataTypes.DATE,
        defaultValue: Date.now,
      },
      return: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "loan",
    }
  );
  return loan;
};
