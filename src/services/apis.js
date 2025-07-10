const BASE_URL = import.meta.env.VITE_BASE_URL;
const userRoutes=BASE_URL+'/auth';
const profileRoutes=BASE_URL+'/profile';
const courceRoutes=BASE_URL+'/cource';
const paymentRoutes=BASE_URL+'/payment'

export const categories={
    CATEGORIES_API: BASE_URL + "/cource/showAllCategories",
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
 
