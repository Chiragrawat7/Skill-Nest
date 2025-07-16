import React from "react";
import logo1 from "../../../assets/TimeLineLogo/logo1.svg";
import logo2 from "../../../assets/TimeLineLogo/logo2.svg";
import logo3 from "../../../assets/TimeLineLogo/logo3.svg";
import logo4 from "../../../assets/TimeLineLogo/logo4.svg";
import timelineImage from "../../../assets/Images/TimelineImage.png";

const timeline = [
  {
    logo: logo1,
    heading: "Leadership",
    description: "Fully Comitted To The Success Company",
  },
  {
    logo: logo2,
    heading: "Responsibility",
    description: "Students will always be our top priority",
  },
  {
    logo: logo3,
    heading: "Flexibility",
    description: "The ability to switch is an important skills",
  },
  {
    logo: logo4,
    heading: "Solve the problem",
    description: "Code your way to a solution",
  },
];
const TimelineSection = () => {
  return (
    <div>
      <div className="flex gap-15 items-center">
        {/* Section 1 */}

        <div className="flex flex-col w-[45%] gap-5">
          {timeline.map((element, index) => {
            return (
              <div className="flex gap-6" key={index}>
                <div className="flex flex-col justify-center">
                  <div className="w-[50px] bg-white flex justify-center rounded-full  items-center h-[50px]">
                    <img src={element.logo} />
                  </div>
                  <div
                    className={`${
                      index !== timeline.length - 1
                        ? "lg:block h-14 border-dotted border-r border-richblack-100 bg-richblack-400/0 w-[26px]"
                        : ""
                    }`}
                  ></div>
                </div>
                <div>
                  <h2 className="font-semibold text-[18px]">
                    {element.heading}
                  </h2>
                  <p className="text-base">{element.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section 2 */}

        <div className="relative  shadow-blue-200 shadow-[0px_0px_30px_0px]">
          <img
            src={timelineImage}
            className="shadow-white object-cover h-fit shadow-[20px_20px_0px_0px]"
            alt="timeline Image"
          />

          <div className="absolute rounded-sm bg-caribbeangreen-700 flex flex-row text-white uppercase py-7 left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className=" flex gap-5 items-center border-r border-caribbeangreen-300 px-7">
              <p className="text-3xl font-bold">10</p>
              <p className="text-caribbeangreen-300 text-sm">
                Years of Experience
              </p>
            </div>

            <div className="flex gap-5 items-center px-7 ">
              <p className="text-3xl font-bold">250</p>
              <p className="text-caribbeangreen-300 text-sm">Type of courses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
