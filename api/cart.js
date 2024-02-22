const Router = require("express").Router();
const Boom = require("boom");
const _ = require("lodash");

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

const getUserCart = async (req, res) => {
  try {
    const data = await CartHelper.getUserCart({
      userId: req.body.verifiedUser.id,
      ...req.query,
    });
    console.log(data);

    return res.status(200).json({ message: "Successfully get data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

const createCart = async (req, res) => {
  try {
    Validation.cartValidation({
      ...req.body,
      userId: req.body.verifiedUser.id,
    });

    const cart = await CartHelper.getCart({
      userId: req.body.verifiedUser.id,
      ...req.body,
    });

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

const updateCart = async (req, res) => {
  try {
    const cart = await CartHelper.getCart(req.params);
    if (_.isEmpty(cart)) {
      return Promise.reject(Boom.notFound("Item Not Found"));
    }

    Validation.cartValidation(req.body);

    const data = await CartHelper.updateCart(req.body, req.params.id);

    return res.status(200).json({ message: "Successfully create data", data });
  } catch (err) {
    console.log(err);
    return res.status(500).send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/", authMiddleware.validateToken, getCart);
Router.get("/user", authMiddleware.validateToken, getUserCart);
Router.post("/create", authMiddleware.validateToken, createCart);
Router.put("/update/:id", authMiddleware.validateToken, updateCart);

module.exports = Router;
