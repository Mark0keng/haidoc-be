const db = require("../models");
const _ = require("lodash");

const getMessage = async (query) => {
  const result = await db.Message.findAll({
    where: {
      ...(query?.roomId && { roomId: query.roomId }),
    },
  });

  return Promise.resolve(result);
};

const createMessage = async (message) => {
  const result = await db.Message.create({
    roomId: message.roomId,
    senderId: message.senderId,
    message: message.message,
    time: message.time,
  });

  return Promise.resolve(result);
};

module.exports = {
  getMessage,
  createMessage,
};
