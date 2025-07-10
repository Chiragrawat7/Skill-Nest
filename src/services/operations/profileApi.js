import { toast } from "react-hot-toast";
import { setLoading, setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { logout } from "./authAPI";
import { profileEndpoints } from "../apis";
const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API } =
  profileEndpoints;

export function getUserDetails(token, navigate) {
  return async (dispatch) => {};
}
export async function getUserEnrolledCources(token) {
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
    console.log(result)
  } catch (error) {
     console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error);
    toast.error("Could Not Get Enrolled Courses");
  }
toast.dismiss(toastId);
  return result;
}
