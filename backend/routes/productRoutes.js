const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  deleteProduct,
} = require("../controllers/productController");

const { protect, admin } = require("../middlewares/authMiddleware.js");

router.route("/").get(getProducts).post(protect, admin, createProduct);

router.get("/top", getTopProducts);

router.route("/:id").get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

router.route("/:id/reviews").post(protect, createProductReview);

module.exports = router;
