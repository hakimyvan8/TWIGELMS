import express from 'express'
// lets use express router
const router = express .Router()
//middleware
import { requireSignin } from '../middlewares';

//import controllers
import  {register, login, logout, currentUser} from '../controllers/auth'

// the 'register' function is exported from the controller file.
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser); //so by the time this middleware executes, we should have the user's ID Available
//and based on that ID we can query our database, and get the current user.

module.exports = router;