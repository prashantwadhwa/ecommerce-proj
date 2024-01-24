const express = require("express");
const router = express.Router();

const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
} = require("../controllers/orderController");

const { protect, admin } = require("../middlewares/authMiddleware");

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);

// GET request to get logged-in user's orders
router.route("/mine").get(protect, getMyOrders);

// GET request to get order by ID (admin only)
router.route("/:id").get(protect, getOrderById);

// PUT request to update order to paid
router.route("/:id/pay").put(protect, updateOrderToPaid);

// PUT request to update order to delivered (admin only)
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

module.exports = router;
