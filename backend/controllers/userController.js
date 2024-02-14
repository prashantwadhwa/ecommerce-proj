const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken.js");

const User = require("../models/userModel");

// Auth user & get token
// POST /api/users/login

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = await generateToken(res, user._id);

    // console.log("login token: ", token);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }
});
// Register a new user
// POST /api/users

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {


    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid user data",
    });
  }
});

// logout user profile
// POST /api/users/logout

const logoutUser = asyncHandler(async (req, res) => {
  // logout ka matlab - cookie delete krdo

  res.clearCookie("jwt");
  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

// get user profile
// GET /api/users/profile

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
});

// update user profile
// PUT /api/users/profile

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
});

// get all users
// GET /api/users
// this is an admin route

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// get user by id
// GET /api/users/:id
// this is an admin route

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
});

// delete users
// DELETE /api/users/:id
// this is an admin route

const deleteUsers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400).json({
        success: false,
        message: "Admin user cannot be deleted",
      });
    }
    await User.deleteOne({ _id: user._id });
    res.status(201).json({ message: "User removed" });
  } else {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
});
// update user
// PUT /api/users/:id
// this is an admin route

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
});

module.exports = {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUsers,
  updateUser,
};
