const Router = require("express").Router();
const Boom = require("boom");

const authMiddleware = require("../middlewares/authMiddleware");

const Validation = require("../helpers/validationHelper");
const CartHelper = require("../helpers/cartHelper");
const GeneralHelper = require("../helpers/generalHelper");

const getCart = async (req, res) => {
  try {
    const data = await CartHelper.getCart(req.query);

    return res.status(200).json({ message: "Successfully get data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

const createCart = async (req, res) => {
  try {
    const data = await CartHelper.getCart(req.body);

    return res.status(200).json({ message: "Successfully get data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/", authMiddleware.validateToken, getCart);
Router.post("/create", authMiddleware.validateToken, createCart);

module.exports = Router;
