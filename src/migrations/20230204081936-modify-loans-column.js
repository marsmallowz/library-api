"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("loans", "loan_time", {
      type: Sequelize.DataTypes.DATE,
      defaultValue: Date.now,
    });
    await queryInterface.changeColumn("loans", "return", {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("loans", "loan_time", {
      type: Sequelize.DataTypes.DATE,
    });
    await queryInterface.changeColumn("loans", "return", {
      type: Sequelize.DataTypes.BOOLEAN,
    });
  },
};
