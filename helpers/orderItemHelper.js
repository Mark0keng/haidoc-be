const db = require("../models");
const _ = require("lodash");

const createOrderItem = async (orderItem) => {
  const result = await db.OrderItem.create({
    orderId: orderItem.orderId,
    productName: orderItem.productName,
    productPrice: orderItem.productPrice,
    count: orderItem.count,
  });

  return Promise.resolve(result);
};

module.exports = {
  createOrderItem,
};
