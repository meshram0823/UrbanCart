import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const addProduct = asyncHandler(async (req, res) => {
  const { fields } = req;
  if (!fields) {
    return res.status(400).json({ error: "Fields are required" });
  }

  const { name, description, price, category, quantity, brand } = fields;

  if (!name || !brand || !description || !price || !category || !quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const product = new Product(fields);
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, quantity, brand } = req.fields;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  if (!name || !brand || !description || !price || !category || !quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { ...req.fields },
      { new: true }
    );

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const product = await Product.findByIdAndDelete(id);
    if (product) {
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: count > pageSize,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  if (!rating || !comment) {
    return res.status(400).json({ error: "Rating and comment are required" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ error: "Product already reviewed" });
    }

    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  const { checked = [], radio = [] } = req.body;

  let args = {};
  if (checked.length > 0) args.category = { $in: checked };
  if (radio.length === 2) args.price = { $gte: radio[0], $lte: radio[1] };

  try {
    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
