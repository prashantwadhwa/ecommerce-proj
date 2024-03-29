const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const path = require("path");

const cors = require("cors");

const PORT = process.env.PORT || 4000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// paypal route for client
app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

app.get("/", (req, res) => {
  res.send("API is running");
});

// running the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
