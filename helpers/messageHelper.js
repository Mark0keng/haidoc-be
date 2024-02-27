const db = require("../models");
const _ = require("lodash");

const AuthHelper = require("../helpers/authHelper");

// const getChat = async (query) => {
//   console.log(query);
//   const result = await db.Chat.findAll({
//     where: {
//       ...(query?.roomId && { roomId: query.roomId }),
//       ...(query?.doctorId && { doctorId: query.doctorId }),
//       ...(query?.clientId && { clientId: query.clientId }),
//     },
//   });

//   return Promise.resolve(result);
// };

const createMessage = async (message) => {
  const result = await db.Message.create({
    roomId: message.roomId,
    senderId: message.senderId,
    message: chat.clientId,
  });

  return Promise.resolve(result);
};

module.exports = {
  getChat,
  createChat,
};
