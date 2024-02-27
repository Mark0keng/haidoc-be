const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

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
const chatRoute = require("./api/chat");

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
app.use("/api/chat", chatRoute);

const server = app.listen(Port, () => {
  console.log(["Info"], `Server started on port ${Port}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`user ${socket.id} join room: ${data}`);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnected", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
