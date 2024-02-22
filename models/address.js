'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Address.init({
    userId: DataTypes.INTEGER,
    provinceId: DataTypes.INTEGER,
    cityId: DataTypes.INTEGER,
    fullAddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Address',
  });
  return Address;
};