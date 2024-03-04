"use strict";
const { Model, TEXT, STRING } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      concern: DataTypes.TEXT,
      consumption: DataTypes.TEXT,
      packaging: DataTypes.STRING,
      manufacture: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      category: DataTypes.STRING,
      stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
