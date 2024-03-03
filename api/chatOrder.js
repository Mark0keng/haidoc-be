const Router = require("express").Router();

const authMiddleware = require("../middlewares/authMiddleware");

const Validation = require("../helpers/validationHelper");
const ChatOrderHelper = require("../helpers/chatOrderHelper");
const GeneralHelper = require("../helpers/generalHelper");

const getUserChatOrder = async (req, res) => {
  try {
    const data = await ChatOrderHelper.getUserChatOrder({
      ...req.query,
      clientId: req.body.verifiedUser.id,
    });

    return res.status(200).json({ message: "Successfully create data", data });
  } catch (err) {
    console.log(err);
    return res.status(500).send(GeneralHelper.errorResponse(err));
  }
};

const createChatOrder = async (req, res) => {
  try {
    const timestamp = Date.now();
    const randomChars = Math.random().toString(36).substring(2, 8);
    const orderId = `CHA-${timestamp}-${randomChars}`;

    Validation.chatOrderValidation({
      ...req.body,
      orderId,
      clientId: req.body.verifiedUser.id,
      status: "pending",
    });

    const data = await ChatOrderHelper.createChatOrder({
      ...req.body,
      orderId,
      clientId: req.body.verifiedUser.id,
      status: "pending",
    });

    return res.status(200).json({ message: "Successfully create data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

const updateChatOrder = async (req, res) => {
  try {
    Validation.chatOrderValidation({
      ...req.body,
      clientId: req.body.verifiedUser.id,
    });

    const data = await ChatOrderHelper.updateChatOrder(
      {
        ...req.body,
        clientId: req.body.verifiedUser.id,
      },
      req.params.id
    );

    return res.status(200).json({ message: "Successfully update data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/user", authMiddleware.validateToken, getUserChatOrder);
Router.post("/create", authMiddleware.validateToken, createChatOrder);
Router.put("/update/:id", authMiddleware.validateToken, updateChatOrder);

module.exports = Router;
