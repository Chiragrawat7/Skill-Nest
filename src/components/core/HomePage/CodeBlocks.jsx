import React from "react";
import { FaArrowRight } from "react-icons/fa";
import CTAButton from "./Button";
import { TypeAnimation } from "react-type-animation";

const CodeBlocks = ({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  backgroundHGradient,
  codecolor,
}) => {
  return (
    <div
      className={`flex ${position} flex-col my-20 justify-between gap-10 max-w-10/12 mx-auto`}
    >
      {/* section 1 */}
      <div className="lg:w-[50%] flex flex-col gap-8 justify-between">
        {heading}
        <div className=" text-richblack-300 font-bold">{subheading}</div>
        <div className="flex gap-7 mt-7">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
            <div className="flex gap-2 items-center">{ctabtn1.btnText}</div>
          </CTAButton>

          <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            {ctabtn2.btnText}
          </CTAButton>
        </div>
      </div>

      {/* section 2 */}

      <div className="h-fit flex text-10  lg:w-[50%] py-4 glass relative">
        {/* HW bg gradient */}
        <div className={`absolute ${backgroundHGradient}`}></div>

        <div className="text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>

        <div
          className={`w-[90%] flex gap-2 font-bold font-mono ${codecolor} pr-2`}
        >
          <TypeAnimation
            sequence={[codeblock, 20000, ""]}
            repeat={Infinity}
            cursor={true}
            omitDeletionAnimation={true}
            style={{
              whiteSpace: "pre-line",
              display: "inline",
              // overflowY:"scroll"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
