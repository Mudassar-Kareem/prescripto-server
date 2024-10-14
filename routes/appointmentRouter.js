const express =require("express");
const { isAuthenticated, isAdmin, isDoctor } = require("../midleware/auth");
const { bookAppointment, userAppointment, appointmentCanclled, getAllAppointment, docAppointment, confirmSlot } = require("../controllers/appointmentController");
const appointmentRouter = express.Router();

appointmentRouter.post("/book-appointment",isAuthenticated,bookAppointment);
appointmentRouter.get("/appointment/:userId",isAuthenticated,userAppointment);
appointmentRouter.post("/cancel-appointment",isAuthenticated,appointmentCanclled);
appointmentRouter.get("/get-all-appointment",isAuthenticated,isAdmin,getAllAppointment);
appointmentRouter.get("/doc-appointment/:docId",isDoctor,docAppointment);
appointmentRouter.put("/confirm/:id",isDoctor,confirmSlot)

module.exports= appointmentRouter