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

const getManyCart = async (req, res) => {
  try {
    const data = await CartHelper.getManyCart(req.query);

    return res.status(200).json({ message: "Successfully get data", data });
  } catch (err) {
    console.log(err);
    return res.status(500).send(GeneralHelper.errorResponse(err));
  }
};

const createCart = async (req, res) => {
  try {
    Validation.cartValidation(req.body);

    const cart = await CartHelper.getCart(req.body);
    console.log(cart);

    if (cart) {
      const data = await CartHelper.updateCart(
        {
          ...cart,
          count: cart.count + 1,
        },
        cart.id
      );

      return res
        .status(200)
        .json({ message: "Successfully create data", data });
    }

    const data = await CartHelper.createCart(req.body);

    return res.status(200).json({ message: "Successfully create data", data });
  } catch (err) {
    console.log(err);
    return res.status(500).send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/", authMiddleware.validateToken, getCart);
Router.get("/all", authMiddleware.validateToken, getManyCart);
Router.post("/create", authMiddleware.validateToken, createCart);

module.exports = Router;
