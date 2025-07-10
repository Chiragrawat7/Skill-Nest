import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authAPI";
import { FaArrowLeft } from "react-icons/fa6";

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleonSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return (
    <div className="text-white flex justify-center items-center mt-[100px] px-3">
      {loading ? (
        <div>Loading</div>
      ) : (
        <div className="max-w-[500px]">
          <h2 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            {!emailSent ? "Reset Your Password" : "Check Your Email"}
          </h2>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
              : `We Have Sentthe Reset email to ${email}`}
          </p>
          <form onSubmit={handleonSubmit} >
            {!emailSent && (
              <label className="w-full">
               <p className=" mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">Email Address<sup className="text-pink-200">*</sup></p> 
                <br />
                <input
                  type="email"
                  required
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="p-3 rounded-md border-b-2 border-richblack-200 focus:outline-0 w-full  bg-richblack-700"
                />
              </label>
            )}
            <br />
            <button type="submit" className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900 hover:cursor-pointer">
              {!emailSent ? "Reset Passwort" : "Resend Email"}
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5"><FaArrowLeft />back to Login</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
