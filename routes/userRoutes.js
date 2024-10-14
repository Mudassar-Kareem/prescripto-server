const express =require("express");
const userRouter = express.Router();
const {createUser, userLogin, loadUser, updateUserInfo, updateUserAvatar, logoutUser, getAllUser, deleteUser} = require("../controllers/userController")
const { isAuthenticated, isAdmin } = require("../midleware/auth");

userRouter.post("/create-user",createUser)
userRouter.post("/login-user",userLogin)
userRouter.get("/load-user",isAuthenticated,loadUser)
userRouter.put("/update-user-info",isAuthenticated,updateUserInfo)
userRouter.put("/update-user-avatar",isAuthenticated,updateUserAvatar)
userRouter.get("/user-logout",isAuthenticated,logoutUser);
userRouter.get("/all-user",isAuthenticated,isAdmin,getAllUser)
userRouter.delete("/delete-user/:id",isAuthenticated,isAdmin,deleteUser)



module.exports= userRouter