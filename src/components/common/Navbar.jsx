import React, { useEffect, useState } from "react";
import { NavbarLinks } from "../../data/navbar-links";
import { Link, matchPath, useLocation } from "react-router-dom";
import logo from "../../assets/Logo/Logo-full-light.png";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import ProfileDropdown from "../core/auth/ProfileDropDown";
import { ACCOUNT_TYPE } from "../../utils/constants";

const Navbar = () => {
  const location = useLocation();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const [subLinks, setsubLinks] = useState([]);

  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      setsubLinks(result.data.allCategories);
      console.log("printing sublinks reuslts", result.data.allCategories);
    } catch (error) {
      console.log("could not fetch category list");
    }
  };

  useEffect(() => {
    fetchSublinks();
  }, []);

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  return (
    <div className="w-full h-14  border-b border-richblack-700 flex items-center">
      <div className="flex w-11/12 max-w-[1260px] justify-between items-center mx-auto">
        <Link to="/">
          <img src={logo} width={160} height={32} />
        </Link>

        {/* navlinks */}
        <nav>
          <ul className="flex gap-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li className="" key={index}>
                {link.title === "Catalog" ? (
                  <div className="hover:cursor-pointer flex items-center gap-1 group relative">
                    <p>{link.title}</p>
                    <IoIosArrowDropdownCircle className="group-hover:-rotate-180 transition-all duration-200" />
                    <div className="invisible absolute left-[50%] top-[50%] flex flex-col rounded-md bg-richblack-5 p-4 z-10 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px] translate-x-[-50%] translate-y-[50%] ">
                      <div className="absolute left-[50%] top-0 h-6 rotate-45 rounded bg-richblack-5 w-6 translate-x-[70%] translate-y-[-45%]"></div>
                      {subLinks.length ? (
                        subLinks.map((sublink, index) => (
                          <Link to={sublink.name.replace(" ", "-")} key={index}>
                            {sublink.name}
                          </Link>
                        ))
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* login/signup/dashboard */}

        <div className="flex gap-3">
          {
          user && user.accountType != ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to={"/dashboard/cart"} className="relative">
              <AiOutlineShoppingCart />
              {totalItems > 0 && <span>{totalItems}</span>}
            </Link>
          )}
          {
          token === null && (
            <Link to={"/login"}>
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md hover:cursor-pointer">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to={"/signup"}>
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md hover:cursor-pointer">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
