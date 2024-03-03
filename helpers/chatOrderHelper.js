const db = require("../models");
const _ = require("lodash");

const getUserChatOrder = async (query) => {
  const result = await db.ChatOrder.findAll({
    where: {
      ...(query?.clientId && { clientId: query.clientId }),
      ...(query?.orderId && { orderId: query.orderId }),
    },
    include: [
      {
        model: db.Doctor,
        as: "doctor",
        attributes: ["imageUrl", "fullName", "userId"],
      },
      {
        model: db.User,
        as: "client",
        attributes: ["username", "id"],
      },
    ],
  });

  return Promise.resolve(result);
};

const createChatOrder = async (chatOrder) => {
  const result = await db.ChatOrder.create({
    orderId: chatOrder.orderId,
    grossAmount: chatOrder.grossAmount,
    chatCost: chatOrder.chatCost,
    serviceCost: chatOrder.serviceCost,
    doctorId: chatOrder.doctorId,
    clientId: chatOrder.clientId,
    status: chatOrder.status,
  });

  return Promise.resolve(result);
};

const updateChatOrder = async (chatOrder, id) => {
  await db.ChatOrder.update(
    {
      orderId: chatOrder?.orderId,
      grossAmount: chatOrder?.grossAmount,
      chatCost: chatOrder?.chatCost,
      serviceCost: chatOrder?.serviceCost,
      doctorId: chatOrder?.doctorId,
      clientId: chatOrder?.clientId,
      status: chatOrder?.status,
    },
    { where: { id } }
  );

  return Promise.resolve(true);
};

module.exports = {
  getUserChatOrder,
  createChatOrder,
  updateChatOrder,
};
