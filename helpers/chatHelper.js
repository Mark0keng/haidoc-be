const db = require("../models");
const _ = require("lodash");

const AuthHelper = require("../helpers/authHelper");

const getChat = async (query) => {
  const result = await db.Chat.findAll({
    where: {
      ...(query?.roomId && { roomId: query.roomId }),
      ...(query?.doctorId && { doctorId: query.doctorId }),
      ...(query?.clientId && { clientId: query.clientId }),
    },
  });

  return Promise.resolve(result);
};

const createChat = async (chat) => {
  await AuthHelper.getProfile(chat.doctorId);
  await AuthHelper.getProfile(chat.clientId);

  const result = await db.Chat.create({
    roomId: chat.roomId,
    doctorId: chat.doctorId,
    clientId: chat.clientId,
  });

  return Promise.resolve(result);
};

module.exports = {
  getChat,
  createChat,
};
