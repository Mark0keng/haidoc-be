const db = require("../models");
const _ = require("lodash");

const ProductHelper = require("../helpers/productHelper");
const AuthHelper = require("../helpers/authHelper");

const getCart = async (query) => {
  const result = await db.Cart.findOne({
    where: {
      ...(query?.productId && { productId: query.productId }),
      ...(query?.userId && { userId: query.userId }),
    },
  });

  return Promise.resolve(result?.dataValues);
};

const getManyCart = async (query) => {
  console.log(query);
  const result = await db.Cart.findAll({
    where: {
      ...(query?.productId && { productId: query.productId }),
      ...(query?.userId && { userId: query.userId }),
    },
    include: [
      {
        model: db.Product,
        as: "products",
        attributes: ["imageUrl", "name", "price", "packaging"],
      },
    ],
  });

  return Promise.resolve(result);
};

const createCart = async (cart) => {
  await AuthHelper.getProfile(cart.userId);
  await ProductHelper.getProductById(cart.productId);

  const result = await db.Cart.create({
    productId: cart.productId,
    userId: cart.userId,
    count: cart.count,
  });

  return Promise.resolve(result);
};

const updateCart = async (cart, cartId) => {
  await AuthHelper.getProfile(cart.userId);
  await ProductHelper.getProductById(cart.productId);

  await db.Cart.update(
    {
      productId: cart.productId,
      userId: cart.userId,
      count: cart.count,
    },
    { where: { id: cartId } }
  );

  return Promise.resolve(true);
};

module.exports = {
  getCart,
  getManyCart,
  createCart,
  updateCart,
};
