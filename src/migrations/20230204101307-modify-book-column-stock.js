"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("books", "stock", {
      type: Sequelize.DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("books", "stock", {
      type: Sequelize.DataTypes.INTEGER,
    });
  },
};
