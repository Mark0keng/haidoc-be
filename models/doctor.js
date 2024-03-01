"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Doctor.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });
    }
  }
  Doctor.init(
    {
      fullName: DataTypes.STRING,
      specialist: DataTypes.STRING,
      experience: DataTypes.INTEGER,
      alumnus: DataTypes.STRING,
      strId: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      imageUrl: DataTypes.STRING,
      cost: DataTypes.
    },
    {
      sequelize,
      modelName: "Doctor",
    }
  );
  return Doctor;
};
