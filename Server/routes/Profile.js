const express=require('express')
const router=express.Router();

const { auth } = require("../middlewares/auth");
const {
    deleteAccount,
    getUserDetails,
    updateProfile,
    updateDisplayPicture,
    getEnrolledCourses
}= require('../controllers/profile')


router.delete('/deleteProfile',auth,deleteAccount)
router.put('/updateProfile',auth, updateProfile)
router.get('/getUserDetails',auth, getUserDetails)

router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
// router.put('/updateProfile',updateProfile)



module.exports=router;
