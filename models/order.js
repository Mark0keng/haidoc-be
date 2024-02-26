"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });
    }
  }
  Order.init(
    {
      orderId: DataTypes.STRING,
      grossAmount: DataTypes.INTEGER,
      shippingCost: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      status: DataTypes.ENUM("pending", "success", "failed"),
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
