import React from "react";
import HighlightText from "./HighlightText";
import CTAButton from "./Button";
import Compare_with_others from "../../../assets/Images/Compare_with_others.svg";
import Plan_your_lessons from "../../../assets/Images/Plan_your_lessons.svg";
import Know_your_progress from "../../../assets/Images/Know_your_progress.svg";
const LearningLanguageSection = () => {
  return (
    <div>
      <div className="flex flex-col gap-5 mt-[130px] items-center mb-14">
        <div className="text-4xl font-semibold text-center">
          Your swiss knife for
          <HighlightText text=" learning any language" />
        </div>

        <div className="text-center mx-auto text-richblack-600 text-base font-medium w-7/10">
          Using spin making learning multiple languages easy. with 20+ languages
          realistic voice-over, progress tracking, custom schedule and more.
        </div>

        <div className="flex items-center justify-center mt-5">
          <img
            src={Know_your_progress}
            alt="Know_your_progress"
            className="object-contain h-[370px] -mr-32"
          />
          <img
            src={Compare_with_others}
            alt="Compare_with_others"
            className="object-contain h-[450px]"
          />
          <img
            src={Plan_your_lessons}
            alt="Plan_your_lessons"
            className="object-contain -ml-36 h-[450px]"
          />
        </div>

        <div className="w-fit">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default LearningLanguageSection;
