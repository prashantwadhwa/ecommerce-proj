const asyncHandler = require("../middlewares/asyncHandler");
const Product = require("../models/productModel");

// get all products
const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const products = await Product.find({ ...keyword });
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }
});

// create a product
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/src/assets/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//update product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);
  const user = req.user._id;

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.user = user;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404).json({ success: false, message: "Product not found" });
  }
});

//delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ success: true, message: "Product Deleted" });
  } else {
    res.status(404).json({ success: false, message: "Product not found" });
  }
});

// create a new review
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // check if the user already reviewed the product
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "Product already reviewed",
      });
    }

    // create a new review
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    // Set the user on the product
    product.user = req.user._id;

    // update the number of reviews
    product.numReviews = product.reviews.length;

    // ab rating ko update krdo
    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length; // round off krna hai

    await product.save();
    return res.status(201).json({ success: true, message: "Review added" });
  } else {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }
});

// get top rated products for caraousel slider
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(5);
  return res.status(200).json(products);
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  deleteProduct,
};
