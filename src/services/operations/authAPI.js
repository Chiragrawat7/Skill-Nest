import { setLoading ,setToken} from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";
import { toast } from "react-hot-toast";
import { resetCart } from "../../slices/cartSlice";

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", endpoints.SIGN_UP, {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNo:null,
        otp,
      });

      console.log("SIGNUP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      const userImage = response.data?.userExist?.image
        ? response.data.userExist.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.userExist, image: userImage }))
      toast.success("Signup Successful");
      navigate("/login");
    } catch (error) {
      console.log("SIGNUP API ERROR............", error);
      toast.error("Signup Failed");
      navigate("/signup")
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Logging in...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", endpoints.LOG_IN, {
        email,
        password,
      });

      console.log("LOGIN API RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const user = response.data.userExist;

      // Fallback image if user.image is not available
      const userImage = user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`;

      // const finalUser = { ...user, image: userImage };

      // Set Redux state
      dispatch(setToken(response.data.token));
      dispatch(setUser({ ...user, image: userImage }));

      // Store in localStorage
      localStorage.setItem("token", response.data.token); // no stringify needed
      localStorage.setItem("user", JSON.stringify({ ...user, image: userImage }));

      toast.success("Login Successful");
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("LOGIN API ERROR:", error);
      toast.error(error?.response?.data?.message || "Login failed");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", endpoints.SEND_OTP, {
        email,
        checkUserPresent: true,
      });
      console.log("SENDOTP API RESPONSE............", response);

      // console.log(response.data.success);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");
      navigate("/verify-email");
    } catch (error) {
      console.log("SENDOTP API ERROR............", error);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        endpoints.RESETPASSTOKEN_API,
        { email }
      );
      console.log("Reset Password Token Response...", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.log("Reset Password Token Error");
      toast.error("Failed to Send email for Reseting Password");
    }
    dispatch(setLoading(false));
  };
}

export function resetPassword(password, confirmPassword, token,navigate) {
  return async (dispatch) => {
    console.log("Error Occured Here");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", endpoints.RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });
      console.log("reset Password response", response.data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Password Reset Successfully");
      navigate('/login')
    } catch (error) {
      console.log("Reset Password Token Error=",error);
      toast.error("Failed to Reset Password Try Again");
    }
    dispatch(setLoading(false));
  };
}
