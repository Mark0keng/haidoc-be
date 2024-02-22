const Router = require("express").Router();
const axios = require("axios");
const dotenv = require("dotenv");

const authMiddleware = require("../middlewares/authMiddleware");
const Validation = require("../helpers/validationHelper");
const GeneralHelper = require("../helpers/generalHelper");
const AddressHelper = require("../helpers/addressHelper");

dotenv.config();

axios.defaults.baseURL = "https://api.rajaongkir.com/starter";
axios.defaults.headers.common["key"] = process.env.RAJAONGKIR_API_KEY;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

const getProvince = async (req, res) => {
  try {
    const response = await axios.get("/province");

    return res.status(200).json({
      message: "Successfully get data",
      data: response?.data?.rajaongkir?.results,
    });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

const getCity = async (req, res) => {
  try {
    const response = await axios.get(`/city?province=${req?.query?.province}`);

    return res.status(200).json({
      message: "Successfully get data",
      data: response?.data?.rajaongkir?.results,
    });
  } catch (err) {
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
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

Router.get("/province", getProvince);
Router.get("/city", getCity);
Router.post("/create", authMiddleware.validateToken, createAddress);

module.exports = Router;
