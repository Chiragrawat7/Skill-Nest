const BASE_URL = import.meta.env.VITE_BASE_URL;
const userRoutes=BASE_URL+'/auth';
const profileRoutes=BASE_URL+'/profile';
const courseRoutes=BASE_URL+'/course';
const paymentRoutes=BASE_URL+'/payment'

export const categories={
    CATEGORIES_API: courseRoutes + "/showAllCategories",
}
export const endpoints={
    SEND_OTP:userRoutes+'/sendotp',
    SIGN_UP:userRoutes+"/signup",
    LOG_IN:userRoutes+'/login',
    RESETPASSTOKEN_API: userRoutes + "/reset-password-token",
    RESETPASSWORD_API: userRoutes + "/reset-password",
}
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
}

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: paymentRoutes + "/capturePayment",
  COURSE_VERIFY_API: paymentRoutes + "/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: paymentRoutes + "/sendPaymentSuccessEmail",
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
}
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: profileRoutes + "/updateDisplayPicture",
  UPDATE_PROFILE_API: profileRoutes + "/updateProfile",
  CHANGE_PASSWORD_API: userRoutes + "/changepassword",
  DELETE_PROFILE_API: profileRoutes + "/deleteProfile",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: courseRoutes + "/getAllCourses",
  COURSE_DETAILS_API: courseRoutes + "/getCourseDetails",
  EDIT_COURSE_API: courseRoutes + "/editCourse",
  COURSE_CATEGORIES_API: courseRoutes + "/showAllCategories",
  CREATE_COURSE_API: courseRoutes + "/createCourse",
  CREATE_SECTION_API: courseRoutes + "/addSection",
  CREATE_SUBSECTION_API: courseRoutes + "/addSubSection",
  UPDATE_SECTION_API: courseRoutes + "/updateSection",
  UPDATE_SUBSECTION_API: courseRoutes + "/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: courseRoutes + "/getInstructorCourses",
  DELETE_SECTION_API: courseRoutes + "/deleteSection",
  DELETE_SUBSECTION_API: courseRoutes + "/deleteSubSection",
  DELETE_COURSE_API: courseRoutes + "/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    courseRoutes + "/getFullCourseDetails",
  LECTURE_COMPLETION_API: courseRoutes + "/updateCourseProgress",
  CREATE_RATING_API: courseRoutes + "/createRating",
}

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: courseRoutes + "/getCategoryPageDetails",
}
 
