const Router = require("express").Router();
const Boom = require("boom");
const _ = require("lodash");

const authMiddleware = require("../middlewares/authMiddleware");

const Validation = require("../helpers/validationHelper");
const ChatHelper = require("../helpers/chatHelper");
const GeneralHelper = require("../helpers/generalHelper");

const getChat = async (req, res) => {
  try {
    const data = await ChatHelper.getChat(req.query);

    return res.status(200).json({ message: "Successfully get data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

const createChat = async (req, res) => {
  try {
    Validation.chatValidation(req.body);

    const data = await ChatHelper.createChat(req.body);

    return res.status(200).json({ message: "Successfully create data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

const deleteChat = async (req, res) => {
  try {
    const data = await ChatHelper.deleteChat(req.params.id);

    return res.status(200).json({ message: "Successfully delete data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/", authMiddleware.validateToken, getChat);
Router.post("/create", authMiddleware.validateToken, createChat);
Router.delete(
  "/delete/:id",
  authMiddleware.validateToken,
  authMiddleware.isDoctor,
  deleteChat
);

module.exports = Router;
