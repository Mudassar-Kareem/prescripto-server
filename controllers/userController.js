const catchAsyncErrors = require("../midleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary").v2;
const userModal = require("../modal/userModal");
const sendToken = require("../utils/sendToken");

// create user
const createUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;
    const isEmailExist = await userModal.findOne({ email });
    // Check if email already exists
    if (isEmailExist) {
      return next(new ErrorHandler("Email already exist", 400));
    }
    // Upload avatar to Cloudinary
    const myCloud = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
    });

    const user = await userModal.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    //send token and save to cookies
    sendToken(user, 201, res, "User Created successfully");
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// user Login
const userLogin = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModal.findOne({ email }).select("+password");
    if (!user) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      );
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ErrorHandler("Wrong Email or Password", 400));
    }
    sendToken(user, 200, res, "User Login Successfully");
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// remember user
const loadUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await userModal.findById(req.user.id);
    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update user info
const updateUserInfo = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, dob } = req.body;
    const user = await userModal.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return next(new ErrorHandler("Incorrect password", 401));
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (dob) user.dob = dob;
    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update user avatar
const updateUserAvatar = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await userModal.findById(req.user.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 500));
    }
    if (req.body.avatar !== "") {
      const imageId = user.avatar.public_id;
      await cloudinary.uploader.destroy(imageId);
      const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
      });
      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    await user.save();
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// get all user admin
const getAllUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await userModal.find();
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// delete user
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await userModal.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new ErrorHandler("User Not found", 500));
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// logout user
const logoutUser = catchAsyncErrors(async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      succes: true,
      message: "User logout successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = {
  createUser,
  userLogin,
  loadUser,
  updateUserInfo,
  updateUserAvatar,
  logoutUser,
  getAllUser,
  deleteUser,
};
