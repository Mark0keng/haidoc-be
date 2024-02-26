const Router = require("express").Router();
const axios = require("axios");
const dotenv = require("dotenv");

const authMiddleware = require("../middlewares/authMiddleware");
const Validation = require("../helpers/validationHelper");
const GeneralHelper = require("../helpers/generalHelper");
const AddressHelper = require("../helpers/addressHelper");

dotenv.config();

const getProvince = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.rajaongkir.com/starter/province",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          key: process.env.RAJAONGKIR_API_KEY,
        },
      }
    );

    return res.status(200).json({
      message: "Successfully get data",
      data: response?.data?.rajaongkir?.results,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(GeneralHelper.errorResponse(err));
  }
};

const getCity = async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.rajaongkir.com/starter/city?province=${req?.query?.province}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          key: process.env.RAJAONGKIR_API_KEY,
        },
      }
    );

    return res.status(200).json({
      message: "Successfully get data",
      data: response?.data?.rajaongkir?.results,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(GeneralHelper.errorResponse(err));
  }
};

const getShippingCost = async (req, res) => {
  try {
    const response = await axios.post(
      `https://api.rajaongkir.com/starter/cost`,
      {
        origin: Number(req.query.origin),
        destination: Number(req.query.destination),
        weight: Number(req.query.weight),
        courier: req.query.courier,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          key: process.env.RAJAONGKIR_API_KEY,
        },
      }
    );

    return res.status(200).json({
      message: "Successfully get data",
      data: response?.data?.rajaongkir,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(GeneralHelper.errorResponse(err));
  }
};

const getAddress = async (req, res) => {
  try {
    const data = await AddressHelper.getAddress({
      userId: req?.body?.verifiedUser?.id,
      ...req.query,
    });

    return res.status(200).json({
      message: "Successfully get data",
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(GeneralHelper.errorResponse(err));
  }
};

const createAddress = async (req, res) => {
  try {
    Validation.addressValidation({
      userId: req?.body?.verifiedUser?.id,
      ...req.body,
    });

    const data = await AddressHelper.createAddress({
      userId: req?.body?.verifiedUser?.id,
      ...req.body,
    });

    return res.status(200).json({
      message: "Successfully get data",
      data,
    });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

const updateAddress = async (req, res) => {
  try {
    Validation.addressValidation({
      userId: req?.body?.verifiedUser?.id,
      ...req.body,
    });

    const data = await AddressHelper.updateAddress({
      userId: req?.body?.verifiedUser?.id,
      ...req.body,
    });

    return res.status(200).json({
      message: "Successfully get data",
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/province", getProvince);
Router.get("/city", getCity);
Router.get("/shipping-cost", getShippingCost);
Router.get("/", authMiddleware.validateToken, getAddress);
Router.post("/create", authMiddleware.validateToken, createAddress);
Router.put("/update", authMiddleware.validateToken, updateAddress);

module.exports = Router;
