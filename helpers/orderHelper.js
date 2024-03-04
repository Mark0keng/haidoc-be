const db = require("../models");
const _ = require("lodash");

const CartHelper = require("../helpers/cartHelper");
const ProductHelper = require("../helpers/productHelper");
const OrderItemHelper = require("../helpers/orderItemHelper");
const Boom = require("boom");
const { where } = require("sequelize");

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
  try {
    const result = await db.sequelize.transaction(async (t) => {
      const orderData = await db.Order.create(
        {
          orderId: order.orderId,
          grossAmount: order.grossAmount,
          shippingCost: order.shippingCost,
          userId: order.userId,
          status: order.status,
        },
        { transaction: t }
      );

      const cart = await db.Cart.findAll(
        {
          where: {
            userId: order.userId,
          },
          include: [
            {
              model: db.Product,
              as: "products",
              attributes: [
                "id",
                "imageUrl",
                "name",
                "price",
                "packaging",
                "stock",
              ],
            },
          ],
        },
        { transaction: t }
      );

      for (const item of cart) {
        if (item.products.stock < item.count) {
          throw Boom.badRequest("Stock not enough");
        }

        await db.OrderItem.create(
          {
            orderId: order.orderId,
            productId: item.products.id,
            productName: item.products.name,
            productPrice: item.products.price,
            count: item.count,
          },
          { transaction: t }
        );

        await db.Product.update(
          {
            stock: item.products.stock - item.count,
          },
          { where: { id: item.productId } },
          { transaction: t }
        );
      }

      return orderData;
    });

    return result;
  } catch (error) {}
};

const updateOrder = async (order, id) => {
  await db.Order.update(
    {
      orderId: order.orderId,
      grossAmount: order.grossAmount,
      shippingCost: order.shippingCost,
      userId: order.userId,
      status: order.status,
    },
    { where: { id } }
  );

  return Promise.resolve(true);
};

module.exports = {
  createOrder,
  getUserOrder,
  updateOrder,
};
