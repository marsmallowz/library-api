"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "admin", {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "admin", {
      type: Sequelize.DataTypes.BOOLEAN,
    });
  },
};
