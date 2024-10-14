const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email!"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false,
  },
  specialty: {
    type: String,
    required: true
  },
  degree: {
    type: String,
  },
  experience: {
    type: String,
  },
  about: {
    type: String,
  },
  fees: {
    type: Number,
  },
  address:{
    type:String
  },
  
  slot_booked:{
    type: Object,
    default: {}
  },
  
  
  role: {
    type: String,
    default: "doctor",
  },
  
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },

});

// hash password
doctorSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next
    }
    this.password = await bcrypt.hash(this.password,10)
});

// compare password
doctorSchema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword,this.password)
}

// get jwt token
doctorSchema.methods.getJwtToken= function(){
    return jwt.sign({id: this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:"7d",
    })
}

const doctorModel = mongoose.model("Doctor", doctorSchema);
module.exports = doctorModel;