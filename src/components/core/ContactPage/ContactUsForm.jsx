import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../../services/apiConnector";
import { contactusEndpoint } from "../../../services/apis";
import countrycode from "../../../data/countrycode.json";
// import "../../../App.css";


const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        phoneNumber: "",
      });
    }
  }, [isSubmitSuccessful, reset]);

  const submitContactForm = async (data) => {
    console.log(data);
    try {
      setLoading(true);
      const response = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      );
      console.log("logging response of contact us form...", response);
    } catch (error) {
      console.log("error in sending response", error.response);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(submitContactForm)}>
      <div className="flex flex-col gap-5 w-[80%] mx-auto">
        <div className="flex lg:flex-row flex-col gap-5">
          {/* first name */}
          <div className="flex flex-col ">
            <label htmlFor="firstName">First Name </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter first name"
              className="form-style mt-2 text-white focus:outline-none bg-[#2c333f]  text-base leading-6 rounded-lg p-3 shadow-[0_0_0_#0000,0_0_0_#0000,0_1px_0_0_hsla(0,0%,100%,0.5)]"
              {...register("firstName", { required: true })}
            />
            {errors.firstName && <span>please enter Your Name</span>}
          </div>

          {/* lastName */}
          <div className="flex flex-col">
            <label htmlFor="lastName">Last Name </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter last name"
              className="form-style mt-2 text-white focus:outline-none bg-[#2c333f]  text-base leading-6 rounded-lg p-3 shadow-[0_0_0_#0000,0_0_0_#0000,0_1px_0_0_hsla(0,0%,100%,0.5)]"
              {...register("lastName")}
            />
          </div>
        </div>

        {/* email */}
        <div>
          <label htmlFor="email">Email Address </label>
          <br />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter email"
            className="form-style mt-2 text-white focus:outline-none bg-[#2c333f]  text-base leading-6 rounded-lg p-3 shadow-[0_0_0_#0000,0_0_0_#0000,0_1px_0_0_hsla(0,0%,100%,0.5)] w-full"
            {...register("email", { required: true })}
          />
          {errors.email && <span>please enter Your email Address</span>}
        </div>

        {/* phone */}
        <div className="flex flex-col gap-2">
          <label htmlFor="phoneNumber">Phone Number</label>

          <div className="flex w-full " id="phoneNumber">
            {/* dropdown */}

            <div className="flex items-center">
              <select
                name="dropdown"
                id="dropdown"
                {...register("countrycode", { required: true })}
                defaultValue={'+91'}
                className="bg-richblack-600 h-[30px] w-[30%] rounded-md"
              >
                {countrycode.map((element, index) => (
                  <option
                    key={index}
                    value={element.code}
                    // selected={`${'+91' === element.code}`}
                  >
                    {element.code}-{element.country}
                  </option>
                ))}
              </select>
            </div>

            {/* phone number */}
            <div className="w-full">
              <input
                type="number"
                name="phoneNumber"
                placeholder="12345-67890"
               className="form-style mt-2 text-white focus:outline-none bg-[#2c333f]  text-base leading-6 rounded-lg p-3 shadow-[0_0_0_#0000,0_0_0_#0000,0_1px_0_0_hsla(0,0%,100%,0.5)]"
                {...register("phoneNumber", {
                  required: true,
                  maxLength: { value: 10, message: "invalid phone number" },
                  minLength: { value: 8, message: "invalid phone number" },
                })}

              />
              {errors.phoneNumber && <span><br/>{errors.phoneNumber.message}</span>}
            </div>
          </div>
        </div>

        {/* message */}
        <div>
          <label htmlFor="message">Message</label>
          <br />
          <textarea
            id="message"
            name="message"
            cols={30}
            rows={7}
            className="form-style mt-2 text-white focus:outline-none bg-[#2c333f]  text-base leading-6 rounded-lg p-3 shadow-[0_0_0_#0000,0_0_0_#0000,0_1px_0_0_hsla(0,0%,100%,0.5)] w-full"
            placeholder="Enter Your message here"
            {...register("message", { required: true })}
          />
          {errors.message && <span>please enter Your Message</span>}
        </div>
        <button
          type="submit"
          className="rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-95 hover:shadow-none  disabled:bg-richblack-500 sm:text-[16px] "
        >
          Send Message
        </button>
      </div>
    </form>
  );
};

export default ContactUsForm;
