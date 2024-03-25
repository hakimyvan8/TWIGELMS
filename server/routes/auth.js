import express from 'express'
// lets use express router
const router = express .Router()
//middleware
import { requireSignin } from '../middlewares';

//import controllers
import  {register, login, logout, currentUser, sendTestEmail, forgotPassword, resetPassword} from '../controllers/auth';

// the 'register' function is exported from the controller file.
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser); //so by the time this middleware executes, we should have the user's ID Available
//and based on that ID we can query our database, and get the current user.

//lets create a get route to send emails
router.get("/send-email", sendTestEmail);
router.post("/forgot-password", forgotPassword);

//let's add the reset password route
router.post("/reset-password", resetPassword);
module.exports = router;