const express = require("express");
const cors = require("cors");

const app = express();
const Port = 5000;

// Import Routes
const authRoute = require("./api/auth");
const productRoute = require("./api/product");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route
app.use("/", authRoute);
app.use("/product", productRoute);

app.listen(Port, () => {
  console.log(["Info"], `Server started on port ${Port}`);
});
