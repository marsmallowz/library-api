"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("books_categories", {
      book_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("books_categories", {
      fields: ["book_id"],
      type: "foreign key",
      name: "fk_booksCategories_books",
      references: {
        table: "books",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("books_categories", {
      fields: ["category_id"],
      type: "foreign key",
      name: "fk_booksCategories_categories",
      references: {
        table: "categories",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "books_categories",
      "fk_booksCategories_books"
    );
    await queryInterface.removeConstraint(
      "books_categories",
      "fk_booksCategories_categories"
    );
    await queryInterface.dropTable("books_categories");
  },
};
