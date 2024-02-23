const db = require("../models");
const _ = require("lodash");
const Boom = require("boom");

const getAddress = async (query) => {
  const result = await db.Address.findOne({
    where: {
      ...(query?.userId && { userId: query.userId }),
    },
  });

  if (_.isEmpty(result)) {
    return Promise.reject(Boom.notFound("User address not found"));
  }

  return Promise.resolve(result);
};

const createAddress = async (address) => {
  const result = await db.Address.create({
    userId: address?.userId,
    provinceId: address?.provinceId,
    cityId: address?.cityId,
    fullAddress: address?.fullAddress,
  });

  return Promise.resolve(result);
};

const updateAddress = async (address) => {
  const result = await db.Address.update(
    {
      userId: address?.userId,
      provinceId: address?.provinceId,
      cityId: address?.cityId,
      fullAddress: address?.fullAddress,
    },
    {
      where: {
        userId: address?.userId,
      },
    }
  );

  return Promise.resolve(result);
};

module.exports = {
  getAddress,
  createAddress,
  updateAddress,
};
