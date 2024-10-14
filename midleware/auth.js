const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const userModal = require("../modal/userModal");
const jwt = require("jsonwebtoken");
const doctorModel = require("../modal/doctorModal");

exports.isAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please login to continue",401))
    }
    const decoded = await jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = await userModal.findById(decoded.id);
    next();
})

exports.isDoctor = catchAsyncErrors(async(req,res,next)=>{
    const {doctor_token} = req.cookies;
    if(!doctor_token){
        return next(new ErrorHandler("Please login to continue",401))
    }
    const decoded = await jwt.verify(doctor_token,process.env.JWT_SECRET_KEY);
    req.doctor = await doctorModel.findById(decoded.id);
    next();
})

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
      return next(); 
    }
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  };