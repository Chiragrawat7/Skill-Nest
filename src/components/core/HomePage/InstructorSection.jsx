import React from "react";
import Instructor from "../../../assets/Images/Instructor.png";
import HighlightText from "./HighlightText";
import CTAButton from './Button'
import { FaArrowRight } from "react-icons/fa";
const InstructorSection = () => {
  return (
    <div className="mt-16">
      <div className="flex items-center gap-20">
      <div className="w-[50%]">
        <img src={Instructor} className=" shadow-white shadow-[-20px_-20px_0_0]" alt="Instructor_img" />
      </div>

      <div className="flex flex-col w-[50%] gap-10">
        <div className="text-4xl font-semibold w-[50%]">
            Become an <HighlightText text='Instructor'/>
        </div>
        <p className="font-medium text-[16px] text-richblack-300">
        Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
        </p>

       <div className="w-fit">
       <CTAButton
            active={true}
            linkto={'/signup'}>
            <div className="flex flex-row gap-2 items-center">
                start learning Today
                <FaArrowRight/>

            </div>
        </CTAButton>

       </div>
      </div>
      </div>
    </div>
  );
};

export default InstructorSection;
