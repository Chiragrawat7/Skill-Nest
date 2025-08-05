const express=require('express')
const router=express.Router();


const {capturePayment,verifyPayment,sendPaymentSuccessEmail}=require('../controllers/payments')
const {auth,isStudent,isInstructor,isAdmin}=require('../middlewares/auth')

router.post('/capturePayment',auth,isStudent,capturePayment);
router.post('/sendPaymentSuccessEmail',auth,sendPaymentSuccessEmail)

router.post('/verifyPayment',auth,isStudent,verifyPayment);


module.exports=router;
