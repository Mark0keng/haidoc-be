"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chat.belongsTo(models.Doctor, {
        as: "doctor",
        foreignKey: "doctorId",
        targetKey: "userId",
      });

      Chat.belongsTo(models.User, {
        as: "client",
        foreignKey: "clientId",
      });

      Chat.hasMany(models.Message, {
        as: "latestMessage",
        foreignKey: "roomId",
        sourceKey: "roomId",
      });
    }
  }
  Chat.init(
    {
      roomId: DataTypes.STRING,
      doctorId: DataTypes.INTEGER,
      clientId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );
  return Chat;
};
