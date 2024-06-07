import express from 'express'
// lets use express router
const router = express .Router()
//middleware
import { requireSignin } from '../middlewares';

//import controllers
import  {makeInstructor, getAccountStatus, currentInstructor} from '../controllers/instructor';


router.post("/make-instructor", requireSignin, makeInstructor);

// //post the current instructor route
// router.post("/current-instructor", requireSignin, currentInstructor);

// this route is for getting the account status of the user if he is an instructor or not
router.post("/get-account-status", requireSignin, getAccountStatus);

router.get("/current-instructor", requireSignin, currentInstructor);

module.exports = router;