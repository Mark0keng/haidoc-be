"use strict";

const AuthHelper = require("../helpers/authHelper");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "admin",
          email: "admin@gmail.com",
          password: AuthHelper.__hashPassword("admin123"),
          role: 3,
        },
        {
          username: "farras",
          email: "farras@gmail.com",
          password: AuthHelper.__hashPassword("farras123"),
          role: 1,
        },
        {
          username: "arkan",
          email: "arkan@gmail.com",
          password: AuthHelper.__hashPassword("arkan123"),
          role: 1,
        },
        {
          username: "budiyanto",
          email: "budiyanto@gmail.com",
          password: AuthHelper.__hashPassword("doctor123"),
          role: 2,
        },
        {
          username: "diandra",
          email: "diandra@gmail.com",
          password: AuthHelper.__hashPassword("doctor123"),
          role: 2,
        },
        {
          username: "eva",
          email: "eva@gmail.com",
          password: AuthHelper.__hashPassword("doctor123"),
          role: 2,
        },
        {
          username: "lingga",
          email: "lingga@gmail.com",
          password: AuthHelper.__hashPassword("doctor123"),
          role: 2,
        },
        {
          username: "destrian",
          email: "destrian@gmail.com",
          password: AuthHelper.__hashPassword("doctor123"),
          role: 2,
        },
        {
          username: "prima",
          email: "prima@gmail.com",
          password: AuthHelper.__hashPassword("doctor123"),
          role: 2,
        },
        {
          username: "stephen",
          email: "stephen@gmail.com",
          password: AuthHelper.__hashPassword("doctor123"),
          role: 2,
        },
        {
          username: "caroline",
          email: "caroline@gmail.com",
          password: AuthHelper.__hashPassword("doctor123"),
          role: 2,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
