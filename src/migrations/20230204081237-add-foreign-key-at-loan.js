"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("loans", "user_id", {
      type: Sequelize.INTEGER,
      after: "id",
    });
    await queryInterface.addConstraint("loans", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_loans_user",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addColumn("loans", "book_id", {
      type: Sequelize.INTEGER,
      after: "id",
    });
    await queryInterface.addConstraint("loans", {
      fields: ["book_id"],
      type: "foreign key",
      name: "fk_loans_book",
      references: {
        table: "books",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("loans", "fk_loans_user");
    await queryInterface.removeColumn("loans", "user_id");
    await queryInterface.removeConstraint("loans", "fk_loans_book");
    await queryInterface.removeColumn("loans", "book_id");
  },
};
