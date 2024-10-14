const catchAsyncErrors = require("../midleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const doctorModel = require("../modal/doctorModal");
const userModel = require("../modal/userModal");
const appoinmentModel = require("../modal/appointmentModal");

// book appointment user
const bookAppointment = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    const docData = await doctorModel.findById(docId).select("-password");
    let slot_booked = docData.slot_booked;

    // checking if the slot is booked or not
    if (slot_booked[slotDate]) {
      // check if the specific time slot on that date is already booked
      if (slot_booked[slotDate].includes(slotTime)) {
        return next(new ErrorHandler("Slot already booked", 500));
      } else {
        // if not booked, push the new slot time into the array
        slot_booked[slotDate].push(slotTime);
      }
    } else {
      // if the date does not exist, create an array for that date and add the slot time
      slot_booked[slotDate] = [];
      slot_booked[slotDate].push(slotTime);
    }

    delete docData.slot_booked;
    const appointment = await appoinmentModel.create({
      userId,
      docId,
      slotDate,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
    });
    await doctorModel.findByIdAndUpdate(docId, { slot_booked });
    res.status(201).json({
      success: true,
      appointment,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
// get user appointment
const userAppointment = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log("User ID from request:", userId);

    const appointments = await appoinmentModel.find({ userId });

   

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// get doctor all appointment 
const docAppointment = catchAsyncErrors(async(req,res,next)=>{
  try {
    const docId = req.params.docId;
    const appointments = await appoinmentModel.find({ docId });

    

    res.status(200).json({
      success: true,
      appointments,
    });
    
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
})

// canclled appoint by user
const appointmentCanclled = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointment = await appoinmentModel.findById(appointmentId);
    if (appointment.userId !== userId) {
      return next(new ErrorHandler("user have no appointment", 500));
    }
    await appoinmentModel.findByIdAndUpdate(appointmentId, { canceled: true });
    // realsing the doc slot
    const { docId, slotTime, slotDate } = appointment;
    const doc = await doctorModel.findById(docId);
    let slot_booked = doc.slot_booked;
    slot_booked[slotDate] = slot_booked[slotDate].filter((e) => e !== slotTime);
    await doctorModel.findByIdAndUpdate(docId, { slot_booked });
    res.status(200).json({
      success: true,
      message: "Appointment cancelled",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// get all appointment -- admin --
const getAllAppointment = catchAsyncErrors(async(req,res,next)=>{
  try {
    const appointment = await appoinmentModel.find();
    res.status(200).json({
      success:true,
      appointment
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
})

// confirm slot by doctor 
const confirmSlot = catchAsyncErrors(async (req, res, next) => {
  try {
      const id = req.params.id;
      const { docId } = req.doctor; 
      const appointment = await appoinmentModel.findByIdAndUpdate(id, { isComplete: true }, { new: true });
      
      if (!appointment) {
          return next(new ErrorHandler("Appointment not found", 400));
      }

     

      res.status(200).json({
          success: true,
          message: "Appointment completed"
      });
  } catch (error) {
      return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = { bookAppointment, userAppointment,appointmentCanclled,getAllAppointment,docAppointment,confirmSlot};
