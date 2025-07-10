import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OtpInput from "react-otp-input";
import { Link, useNavigate } from "react-router-dom";
import { signUp, sendOtp } from "../services/operations/authAPI";
import { FaArrowLeft } from "react-icons/fa6";
import { VscDebugRestart } from "react-icons/vsc";

const VerifyEmail = () => {
  const { loading, signupData } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;
    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };

  return (
    <div className="text-white flex justify-center items-center mt-28">
      {loading ? (
        <div>loading...</div>
      ) : (
        <div className="w-[500px] flex flex-col">
          <h2 className="font-semibold text-2xl">Verify Email</h2>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            A Verification code has been sent to you. Enter the code Below
          </p>
          <form onSubmit={handleOnSubmit}>
            <div className="flex justify-center mt-6">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                shouldAutoFocus
                renderInput={(props, index) => (
                  <input
                    {...props}
                    key={index}
                    placeholder="-"
                    className="w-16 h-16 text-2xl text-white bg-richblack-800 
                        placeholder:text-richblack-400 border border-richblack-600 
                        rounded-md text-center focus:outline-none focus:border-yellow-50 
                        mx-[6px]"
                  />
                )}
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              Verify Email
            </button>
          </form>

          <div className="flex justify-between mt-7">
            <div>
              <Link to="/login">
                <p className="flex gap-1 items-center">
                  <FaArrowLeft />
                  back to Login
                </p>
              </Link>
            </div>
            <button
              onClick={() => dispatch(sendOtp(signupData.email, navigate))}
            >
              <p className="flex items-center gap-1 text-blue-100 hover:cursor-pointer">
                <VscDebugRestart className="text-[17px]" />
                Resend it
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
