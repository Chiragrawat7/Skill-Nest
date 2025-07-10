import React from "react";
import { Link } from "react-router-dom";

const Button = ({ linkto, active, children }) => {
  return (
    <Link to={linkto}>
      <div
        className={`text-center px-6 py-3 text-[13px] rounded-md font-bold hover:scale-95 transition-all duration-200
        ${
          active
            ? "bg-yellow-50 text-black"
            : "bg-richblack-800 "
        }`}
      >
        {children}
      </div>
    </Link>
  );
};

export default Button;
