const Router = require("express").Router();

const authMiddleware = require("../middlewares/authMiddleware");

const Validation = require("../helpers/validationHelper");
const MessageHelper = require("../helpers/messageHelper");
const GeneralHelper = require("../helpers/generalHelper");

const getMessage = async (req, res) => {
  try {
    const data = await MessageHelper.getMessage(req.query);

    return res.status(200).json({ message: "Successfully get data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

const getLatestMessage = async (req, res) => {
  try {
    const data = await MessageHelper.getLatestMessage(req.query);

    return res.status(200).json({ message: "Successfully get data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

const createMessage = async (req, res) => {
  try {
    Validation.messageValidation(req.body);

    const data = await MessageHelper.createMessage(req.body);

    return res.status(200).json({ message: "Successfully create data", data });
  } catch (err) {
    return res
      .status(GeneralHelper.statusResponse(err))
      .send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/", authMiddleware.validateToken, getMessage);
Router.get("/latest", authMiddleware.validateToken, getLatestMessage);
Router.post("/create", authMiddleware.validateToken, createMessage);

module.exports = Router;
