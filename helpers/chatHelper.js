const db = require("../models");
const _ = require("lodash");

const AuthHelper = require("../helpers/authHelper");
const Boom = require("boom");

const getChat = async (query) => {
  const result = await db.Chat.findAll({
    where: {
      ...(query?.roomId && { roomId: query.roomId }),
      ...(query?.doctorId && { doctorId: query.doctorId }),
      ...(query?.clientId && { clientId: query.clientId }),
    },
    include: [
      {
        model: db.Doctor,
        as: "doctor",
        attributes: ["imageUrl", "fullName", "userId", "specialist"],
      },
      {
        model: db.User,
        as: "client",
        attributes: ["username", "id"],
      },
      {
        model: db.Message,
        as: "latestMessage",
        attributes: ["message", "time"],
        limit: 1,
        order: [["createdAt", "DESC"]],
      },
    ],
  });

  return Promise.resolve(result);
};

const createChat = async (chat) => {
  await AuthHelper.getProfile(chat.doctorId);
  await AuthHelper.getProfile(chat.clientId);

  if (chat.doctorId === chat.clientId) {
    return Promise.reject(Boom.badRequest("Same user cannot chat"));
  }

  const result = await db.Chat.create({
    roomId: chat.roomId,
    doctorId: chat.doctorId,
    clientId: chat.clientId,
  });

  return Promise.resolve(result);
};

const deleteChat = async (id) => {
  const chatData = await db.Chat.findOne({
    where: {
      id,
    },
  });

  if (_.isEmpty(chatData)) {
    return Promise.reject(Boom.notFound("Chat Not Found"));
  }

  const result = await db.Chat.destroy({
    where: {
      id,
    },
  });

  return Promise.resolve(result);
};

module.exports = {
  getChat,
  createChat,
  deleteChat,
};
