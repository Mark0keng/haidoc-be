const db = require("../models");
const _ = require("lodash");

const getUserOrder = async (query) => {
  const result = await db.Order.findAll({
    where: {
      ...(query?.userId && { userId: query.userId }),
      ...(query?.orderId && { orderId: query.orderId }),
    },
    include: [
      {
        model: db.User,
        as: "user",
        attributes: ["username", "email"],
      },
    ],
  });

  return Promise.resolve(result);
};

const createOrder = async (order) => {
  const result = await db.Order.create({
    orderId: order.orderId,
    grossAmount: order.grossAmount,
    shippingCost: order.shippingCost,
    userId: order.userId,
    status: order.status,
  });

  return Promise.resolve(result);
};

module.exports = {
  createOrder,
  getUserOrder,
};
