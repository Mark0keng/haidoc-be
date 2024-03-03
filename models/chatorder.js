"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ChatOrder.belongsTo(models.Doctor, {
        as: "doctor",
        foreignKey: "doctorId",
        targetKey: "userId",
      });

      ChatOrder.belongsTo(models.User, {
        as: "client",
        foreignKey: "clientId",
      });
    }
  }
  ChatOrder.init(
    {
      orderId: DataTypes.STRING,
      grossAmount: DataTypes.INTEGER,
      chatCost: DataTypes.INTEGER,
      serviceCost: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      clientId: DataTypes.INTEGER,
      status: DataTypes.ENUM("pending", "success", "failed"),
    },
    {
      sequelize,
      modelName: "ChatOrder",
    }
  );
  return ChatOrder;
};
