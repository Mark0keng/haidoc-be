const Router = require("express").Router();
const axios = require("axios");
const Boom = require("boom");

const authMiddleware = require("../middlewares/authMiddleware");

const OrderHelper = require("../helpers/orderHelper");
const GeneralHelper = require("../helpers/generalHelper");

const getPayment = async (req, res) => {
  try {
    const orderExist = await OrderHelper.getUserOrder({
      ...req.query,
      userId: req.body.verifiedUser.id,
    });
    if (orderExist.length < 1) {
      return Promise.reject(Boom.notFound("Order Not Found"));
    }

    const order = orderExist[0];

    const requestPayment = await axios({
      url: "https://app.sandbox.midtrans.com/snap/v1/transactions",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Basic " + btoa(process.env.MIDTRANS_SERVER_KEY),
      },
      data: {
        transaction_details: {
          order_id: order?.orderId,
          gross_amount: order?.grossAmount,
        },
        credit_card: {
          secure: true,
        },
        // customer_details: {
        //   first_name: order?.user?.username,
        //   email: order?.user?.email,
        // },
      },
    });

    if (requestPayment) {
      return res.status(200).json({
        token: requestPayment.data.token,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/", authMiddleware.validateToken, getPayment);

module.exports = Router;
