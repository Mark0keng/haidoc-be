const express = require("express");
const cors = require("cors");

const app = express();
const Port = 5000;

// Import Routes
const authRoute = require("./api/auth");
const productRoute = require("./api/product");
const cartRoute = require("./api/cart");
const addressRoute = require("./api/address");
const orderRoute = require("./api/order");
const orderItemRoute = require("./api/orderItem");
const paymentRoute = require("./api/payment");
const doctorRoute = require("./api/doctor");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route
app.use("/api/", authRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/address", addressRoute);
app.use("/api/order", orderRoute);
app.use("/api/order-item", orderItemRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/doctor", doctorRoute);

app.listen(Port, () => {
  console.log(["Info"], `Server started on port ${Port}`);
});
