const catchAsyncErrors = require("../midleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary").v2;
const doctorModel = require("../modal/doctorModal");
const doctorToken = require("../utils/doctorToken");

// create doctor
const createDoctor = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password, avatar, specialty } = req.body;
    const isEmailExist = await doctorModel.findOne({ email });
    // Check if email already exists
    if (isEmailExist) {
      return next(new ErrorHandler("Email already exist", 400));
    }
    // Upload avatar to Cloudinary
    const myCloud = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
    });

    const doctor = await doctorModel.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      specialty,
    });
    
   
    if (!doctor.slot) {
      doctor.slot = {};
      await doctor.save();
    }
    
    console.log(doctor);
    
    //send token and save to cookies
    doctorToken(doctor, 201, res, "Doctor profile Created successfully");
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// doctor Login
const doctorLogin = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email }).select("+password");
    if (!doctor) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      );
    }
    const isPasswordValid = await doctor.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ErrorHandler("Wrong Email or Password", 400));
    }
    doctorToken(doctor, 200, res, " Login Successfully");
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// remember doctor
const loadDoctor = catchAsyncErrors(async (req, res, next) => {
  try {
    const doctor = await doctorModel.findById(req.doctor.id);
    if (!doctor) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }
    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update doctor info
const updateDoctorInfo = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password, degree, experience, about, fees, address } =
      req.body;
    const doctor = await doctorModel.findOne({ email }).select("+password");
    if (!doctor) {
      return next(new ErrorHandler("Doctor not found", 404));
    }
    const validPassword = await doctor.comparePassword(password);
    if (!validPassword) {
      return next(new ErrorHandler("Incorrect password", 401));
    }
    if (name) doctor.name = name;
    if (email) doctor.email = email;
    if (degree) doctor.degree = degree;
    if (experience) doctor.experience = experience;
    if (about) doctor.about = about;
    if (fees) doctor.fees = fees;
    if (address) doctor.address = address;
    await doctor.save();

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update doctor avatar
const updateDoctorAvatar = catchAsyncErrors(async (req, res, next) => {
  try {
    const doctor = await doctorModel.findById(req.doctor.id);
    if (!doctor) {
      return next(new ErrorHandler("User not found", 500));
    }
    if (req.body.avatar !== "") {
      const imageId = doctor.avatar.public_id;
      await cloudinary.uploader.destroy(imageId);
      const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
      });
      doctor.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    await doctor.save();
    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// logout doctor
const logoutDoctor = catchAsyncErrors(async (req, res, next) => {
  try {
    res.cookie("doctor_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      succes: true,
      message: "Logout successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// get all doctors
const allDoctors = catchAsyncErrors(async (req, res, next) => {
  try {
    const doctor = await doctorModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// delete doctor --- admin --
const deleteDoctor = catchAsyncErrors(async (req, res, next) => {
  try {
    const doctor = await doctorModel.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return next(new ErrorHandler("Doctor not found", 500));
    }
    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = {
  createDoctor,
  doctorLogin,
  loadDoctor,
  updateDoctorAvatar,
  updateDoctorInfo,
  logoutDoctor,
  allDoctors,
  deleteDoctor,
};
