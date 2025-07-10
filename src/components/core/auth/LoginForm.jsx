import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { login } from "../../../services/operations/authAPI";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function changeHandler(event) {
    setFormData((prev) => {
      return {
        ...prev,
        [event.target.name]:event.target.value
      };
    });
  }const {email,password}=formData

  function submitFormHandler(e){
    e.preventDefault();
    dispatch(login(email,password,navigate))
    // console.log(formData)

  }
  return (
    <form
        onSubmit={submitFormHandler}
     className="mt-5 gap-4 flex flex-col w-full min-w-[450px]">
      <label className="flex gap-1.5 flex-col">
        <p className="text-sm">
          Email Address
          <sup className=" text-red-700"> *</sup>
        </p>
        <input
          placeholder="Enter Your Email "
          required
          type="email"
          value={formData.email}
          name="email"
          onChange={changeHandler}
          className="border-b-1 border-richblack-100 w-full rounded-md bg-richblack-700 p-3 "
        />
      </label>
      <label className="flex gap-1.5 flex-col relative">
        <p className="text-sm">
          Password
          <sup className=" text-red-700"> *</sup>
        </p>
        <input
          placeholder="Enter Password"
          required
          type={showPassword?'text':'password'}
          value={formData.password}
          name="password"
          onChange={changeHandler}
          className="border-b-1 border-richblack-100 w-full rounded-md bg-richblack-700 p-3 "
        />
        <span className="absolute right-3 top-11 cursor-pointer" onClick={()=>setShowPassword(!showPassword)}>
            {
                showPassword?<AiOutlineEyeInvisible/>:<AiOutlineEye/>
            }
        </span>
        <Link to={"/forgot-password"}>
          <p className="text-blue-100 text-xs text-end">Forgot Password</p>
        </Link>
      </label>
      <button className="bg-yellow-50 rounded-md  w-full py-2 cursor-pointer text-richblack-900">
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;
