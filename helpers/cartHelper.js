const Boom = require("boom");
const db = require("../models");
const _ = require("lodash");

const getCart = async (query) => {
  const result = await db.Cart.findAndCountAll({
    where: {
      productId: query.productId && query.productId,
      userId: query.userId && query.userId,
    },
  });

  if (_.isEmpty(result)) {
    return Promise.reject(Boom.notFound("Product Not Found"));
  }

  return Promise.resolve(result);
};

const createCart = async (cart) => {
  const result = await db.Cart.create({
    productId: cart.productId,
    userId: cart.userId,
    count: cart.count,
  });

  return Promise.resolve(result);
};

module.exports = {
  getCart,
  createCart,
};
