const db = require("../models");
const _ = require("lodash");

const createOrder = async (order) => {
  const result = await db.Order.create({
    orderId: order.orderId,
    grossAmount: order.grossAmount,
    userId: order.userId,
  });

  return Promise.resolve(result);
};

module.exports = {
  createOrder,
};
