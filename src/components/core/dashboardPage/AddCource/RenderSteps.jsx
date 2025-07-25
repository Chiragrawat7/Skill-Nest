import { useDispatch, useSelector } from "react-redux";
import React from 'react'
import { FaCheck } from "react-icons/fa";
import CourseInformationForm from "./Course Infromation/CourseInformationForm";
import CourseBuilderForm from "./Course Builder/CourseBuilderForm";
import PublishCourse from './Publish Course/index'
const RenderSteps = () => {
  const { step } = useSelector((state) => state.course);
  const steps = [
    {
      id: 1,
      title: "course Information",
    },
    {
      id: 2,
      title: "course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ];
  return (
   <>
      <div className="relative mb-2 flex w-full justify-center">
        {steps.map((items) => (
          <React.Fragment key={items.id}>
            <div
              className="flex flex-col items-center "
              key={items.id}
            >
              <button
                className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] ${
                  step === items.id
                    ? "border-yellow-50 bg-yellow-900 text-yellow-50"
                    : "border-richblack-700 bg-richblack-800 text-richblack-300"
                } ${step > items.id && "bg-yellow-50 text-yellow-50"}} `}
              >
                {step > items.id ? (
                  <FaCheck className="font-bold text-richblack-900" />
                ) : (
                  items.id
                )}
              </button>
              
            </div>
            {items.id !== steps.length && (
              <>
                <div
                  className={`h-[calc(34px/2)] w-[33%]  border-dashed border-b-2 ${
                  step > items.id  ? "border-yellow-50" : "border-richblack-500"
                } `}
                ></div>
              </>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="relative mb-16 flex w-full select-none justify-between">
        {steps.map((item) => (
          <React.Fragment key={item.id}>
            <div
              className="flex min-w-[130px] flex-col items-center gap-y-2"
              key={item.id}
            >
              
              <p
                className={`text-sm ${
                  step >= item.id ? "text-richblack-5" : "text-richblack-500"
                }`}
              >
                {item.title}
              </p>
            </div>
            
          </React.Fragment>
        ))}
      </div>
      {/* Render specific component based on current step */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 &&  <PublishCourse /> }
    </>
  );
};

export default RenderSteps;
