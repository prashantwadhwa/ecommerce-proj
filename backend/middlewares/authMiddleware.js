const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("./asyncHandler.js");

// protected route ka matlab: agar user logged in hai toh hi access kar skta hai
// admin route ka matlab: agar user logged in hai aur admin hai toh hi access kar skta hai

//protected routes

const protect = asyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")


  ) {
    try {

      // Split the authorization header and get the token
      const token = req.headers.authorization.split(" ")[1];

      const decodedData = await jwt.verify(token, process.env.JWT_SECRET, {
        algorithm: "HS256",
      });


      if (decodedData) {
        req.user = await User.findById(decodedData.userId).select("-password");

        next();
      } else {
        res.status(401).json({
          success: false,
          message: "decoded error ",
        });
      }
    } catch (error) {
      console.error(error);

      // Log the error message to help identify the issue
      console.error("JWT Verification Error:", error.message);

      res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
        error: error.message,
      });
    }
  }
});

// admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Not authorized: not an admin",
    });
  }
};

module.exports = { protect, admin };
