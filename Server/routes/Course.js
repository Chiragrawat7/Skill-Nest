const express=require('express')
const router=express.Router();

const{createcourse,showAllcourses,getcourseDetails,editCourse,getInstructorCourses,deleteCourse,getFullCourseDetails}=require('../controllers/course')
const {showAllCategories,createCategory,categoryPageDetails}=require('../controllers/category')
const {createSection,updateSection,deleteSection}=require('../controllers/section')
const {createSubSection,updateSubSection,deleteSubSection}=require('../controllers/subSection')
const {auth,isStudent,isInstructor,isAdmin}=require('../middlewares/auth')
const {createRating,getAllRating,getAvgRating}=require('../controllers/ratingAndReview');
const { route } = require('./User');

router.post('/createCourse',auth,isInstructor,createcourse)
router.put('/editCourse',auth,isInstructor,editCourse)
router.delete("/deleteCourse", deleteCourse)

router.post('/addSection',auth,isInstructor,createSection)
router.put('/updateSection',auth,isInstructor,updateSection)
router.post('/deleteSection',auth,isInstructor,deleteSection)

router.post('/addSubSection',auth,isInstructor,createSubSection)
router.post('/updateSubSection',auth,isInstructor,updateSubSection)
router.post('/deleteSubSection',auth,isInstructor,deleteSubSection)

router.post("/createCategory",auth,isAdmin,createCategory)
router.get("/showAllCategories",showAllCategories)
router.post("/getCategoryPageDetails",categoryPageDetails)

router.post('/getAllcourses',auth,isInstructor,showAllcourses)
router.get('/getcourseDetails',auth,isInstructor,getcourseDetails)
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)

router.post('/createRating',auth,isStudent,createRating)
router.get('/getAverageRating',getAvgRating)
router.get('/getReviews',getAllRating)





module.exports=router;
