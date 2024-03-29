const Router = require("express").Router();
const Boom = require("boom");
const _ = require("lodash");

const authMiddleware = require("../middlewares/authMiddleware");

const Validation = require("../helpers/validationHelper");
const CartHelper = require("../helpers/cartHelper");
const ProductHelper = require("../helpers/productHelper");
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

    const data = await CartHelper.createCart({
      userId: req.body.verifiedUser.id,
      ...req.body,
    });

    return res.status(200).json({ message: "Successfully create data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

const updateCart = async (req, res) => {
  try {
    const cart = await CartHelper.getCart(req.params);
    if (_.isEmpty(cart)) {
      throw Boom.notFound("Item Not Found");
    }

    const product = await ProductHelper.getProductById(cart?.productId);
    console.log(req.body, "<<<<");
    if (_.isEmpty(product)) {
      throw Boom.notFound("Item Not Found");
    }
    if (product?.stock < req.body.count) {
      throw Boom.badRequest("Over Stock");
    }

    Validation.cartValidation({
      ...req.body,
      userId: req.body.verifiedUser.id,
    });

    const data = await CartHelper.updateCart(req.body, req.params.id);

    return res.status(200).json({ message: "Successfully create data", data });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

const deleteCart = async (req, res) => {
  try {
    const cart = await CartHelper.getCart(req.params);
    if (_.isEmpty(cart)) {
      throw Boom.notFound("Item Not Found");
    }

    await CartHelper.deleteCart(req.params.id);

    return res.status(200).json({ message: "Successfully delete data" });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/", authMiddleware.validateToken, getCart);
Router.get("/user", authMiddleware.validateToken, getUserCart);
Router.post("/create", authMiddleware.validateToken, createCart);
Router.put("/update/:id", authMiddleware.validateToken, updateCart);
Router.delete("/delete/:id", authMiddleware.validateToken, deleteCart);

module.exports = Router;
