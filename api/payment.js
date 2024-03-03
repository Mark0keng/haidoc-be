const Router = require("express").Router();
const axios = require("axios");
const Boom = require("boom");

const authMiddleware = require("../middlewares/authMiddleware");

const OrderHelper = require("../helpers/orderHelper");
const ChatOrderHelper = require("../helpers/chatOrderHelper");
const GeneralHelper = require("../helpers/generalHelper");

const getPayment = async (req, res) => {
  try {
    let order;

    if (req?.query?.category === "shop") {
      const shopOrder = await OrderHelper.getUserOrder({
        ...req.query,
        userId: req.body.verifiedUser.id,
      });
      if (shopOrder.length < 1) {
        return Promise.reject(Boom.notFound("Order Not Found"));
      }

      order = shopOrder[0];
    }

    if (req?.query?.category === "chat") {
      const chatOrder = await ChatOrderHelper.getUserChatOrder({
        ...req.query,
        clientId: req.body.verifiedUser.id,
      });
      if (chatOrder.length < 1) {
        return Promise.reject(Boom.notFound("Order Not Found"));
      }

      order = chatOrder[0];
    }

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
