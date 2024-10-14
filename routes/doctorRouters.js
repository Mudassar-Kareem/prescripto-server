const express =require("express");
const { createDoctor, doctorLogin, loadDoctor, updateDoctorInfo, updateDoctorAvatar, logoutDoctor, allDoctors, deleteDoctor } = require("../controllers/doctorController");
const { isDoctor, isAuthenticated, isAdmin } = require("../midleware/auth");
const doctorRouter = express.Router();

doctorRouter.post("/create-doctor",createDoctor);
doctorRouter.post("/login-doctor",doctorLogin);
doctorRouter.get("/load-doctor",isDoctor,loadDoctor);
doctorRouter.put("/update-doc-info",isDoctor,updateDoctorInfo)
doctorRouter.put("/update-doc-avatar",isDoctor,updateDoctorAvatar)
doctorRouter.get("/logout-doctor",isDoctor,logoutDoctor)
doctorRouter.get("/all-doctor",allDoctors)
doctorRouter.delete("/delete-doctor/:id",isAuthenticated,isAdmin,deleteDoctor)

module.exports= doctorRouter