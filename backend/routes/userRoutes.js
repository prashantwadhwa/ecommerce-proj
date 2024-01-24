const express = require("express");
const router = express.Router();

const {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUsers,
  updateUser,
} = require("../controllers/userController");

const { protect, admin } = require("../middlewares/authMiddleware");

// protected route ka matlab: agar user logged in hai toh hi access kar skta hai
// admin route ka matlab: agar user logged in hai aur admin hai toh hi access kar skta hai

router.route("/").post(registerUser).get(protect, admin, getUsers);

router.post("/logout", logoutUser);
router.post("/auth", authUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

  router
  .route('/:id')
  .delete(protect, admin, deleteUsers)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

module.exports = router;
