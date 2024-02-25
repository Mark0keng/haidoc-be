const Router = require("express").Router();

const authMiddleware = require("../middlewares/authMiddleware");

const Validation = require("../helpers/validationHelper");
const OrderItemHelper = require("../helpers/orderItemHelper");
const GeneralHelper = require("../helpers/generalHelper");

const createOrderItem = async (req, res) => {
  try {
    Validation.orderItemValidation(req.body);

    const data = await OrderItemHelper.createOrderItem(req.body);

    return res.status(200).json({ message: "Successfully create data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

Router.post("/create", authMiddleware.validateToken, createOrderItem);

module.exports = Router;
