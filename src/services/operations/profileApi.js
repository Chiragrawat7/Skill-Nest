import { toast } from "react-hot-toast";
import { setLoading, setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { logout } from "./authAPI";
import { profileEndpoints } from "../apis";
const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API } =
  profileEndpoints;

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
     const toastId = toast.loading("Loading...");
     dispatch(setLoading(true));
     try {
       const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
         Authorization: `Bearer ${token}`,
       });
       console.log("GET_USER_DETAILS API RESPONSE............", response);
 
       if (!response.data.success) {
         throw new Error(response.data.message);
       }
       const userImage = response.data.data.image
         ? response.data.data.image
         : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`;
       dispatch(setUser({ ...response.data.data, image: userImage }));
     } catch (error) {
       dispatch(logout(navigate));
       console.log("GET_USER_DETAILS API ERROR............", error);
       toast.error("Could Not Get User Details");
     }
     toast.dismiss(toastId);
     dispatch(setLoading(false));
   };
}
export async function getUserEnrolledcourses(token) {
  const toastId = toast.loading("loading...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if(!response.data.success){
        throw new Error(response.data.message)
    }
    result=response.data.data
    console.log("Enrolled courses")
    console.log(result)
  } catch (error) {
     console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error);
    toast.error("Could Not Get Enrolled Courses");
  }
toast.dismiss(toastId);
  return result;
}
