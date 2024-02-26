const Router = require("express").Router();

const authMiddleware = require("../middlewares/authMiddleware");

const Validation = require("../helpers/validationHelper");
const OrderHelper = require("../helpers/orderHelper");
const GeneralHelper = require("../helpers/generalHelper");

const getUserOrder = async (req, res) => {
  try {
    const data = await OrderHelper.getUserOrder({
      userId: req.body.verifiedUser.id,
      ...req.query,
    });

    return res.status(200).json({ message: "Successfully get data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

const createOrder = async (req, res) => {
  try {
    const timestamp = Date.now();
    const randomChars = Math.random().toString(36).substring(2, 8);
    const orderId = `ORD-${timestamp}-${randomChars}`;

    Validation.orderValidation({
      ...req.body,
      orderId,
      userId: req.body.verifiedUser.id,
    });

    const data = await OrderHelper.createOrder({
      ...req.body,
      orderId,
      userId: req.body.verifiedUser.id,
    });

    return res.status(200).json({ message: "Successfully create data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

const updateOrder = async (req, res) => {
  try {
    Validation.orderValidation({
      ...req.body,
      userId: req.body.verifiedUser.id,
    });

    const data = await OrderHelper.updateOrder(
      {
        ...req.body,
        userId: req.body.verifiedUser.id,
      },
      req.params.id
    );

    return res.status(200).json({ message: "Successfully create data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/user", authMiddleware.validateToken, getUserOrder);
Router.post("/create", authMiddleware.validateToken, createOrder);
Router.put("/update/:id", authMiddleware.validateToken, updateOrder);

module.exports = Router;
