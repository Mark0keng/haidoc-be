const db = require("../models");
const _ = require("lodash");

const createAddress = async (address) => {
  const result = await db.Address.create({
    userId: address?.userId,
    provinceId: address?.provinceId,
    cityId: address?.cityId,
    fullAddress: address?.fullAddress,
  });

  return Promise.resolve(result);
};

module.exports = {
  createAddress,
};
