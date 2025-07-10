import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { resetPassword } from "../services/operations/authAPI";
import { FaArrowLeft } from "react-icons/fa6";
import toast from "react-hot-toast";

const UpdatePassword = () => {
  const { loading } = useSelector((state) => state.auth);
  const [showpassword, setShowpassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const { password, confirmPassword } = formData;
  const token = location.pathname.split("/").at(-1);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords does not match");
    }
    dispatch(resetPassword(password, confirmPassword, token, navigate));
  };
  return (
    <div className="text-white flex justify-center items-center mt-22">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h2 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            Choose new Password
          </h2>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            Almost done. Enter Your New Password and youre all set.
          </p>
          <form onSubmit={handleOnSubmit} className="flex flex-col gap-3">
            <label className="w-full relative">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                New Password<sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={`${showpassword ? "text" : "password"}`}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter New Paswordeeee"
                className="p-3 rounded-md border-b-2 border-richblack-200 focus:outline-0 w-full  bg-richblack-700"
              />
              <span
                onClick={() => setShowpassword(!showpassword)}
                className="absolute right-1 top-1/2 text-[20px]"
              >
                {!showpassword ? <IoEye /> : <IoEyeOff />}
              </span>
            </label>

            <label className="w-full relative">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Confirm New Password<sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={`${showConfirmPassword ? "text" : "password"}`}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm Password"
                className="p-3 rounded-md border-b-2 border-richblack-200 focus:outline-0 w-full  bg-richblack-700"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-1 top-1/2 text-[20px]"
              >
                {!showConfirmPassword ? <IoEye /> : <IoEyeOff />}
              </span>
            </label>
            <button
              type="submit"
              className="mt-4 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              Reset Password
            </button>
          </form>
          <div>
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5 mt-5">
                {" "}
                <FaArrowLeft />
                back to Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePassword;
