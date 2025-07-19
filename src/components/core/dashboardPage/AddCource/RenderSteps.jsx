import { useDispatch, useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import CourseInformationFrom from "./Course Infromation/CourseInformationFrom";
import CoursePublishForm from "./Course Builder/CourseBuilderForm";
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
          <>
            <div key={items.id} className="flex flex-col items-center ">
              <div
                className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] ${
                  step === items.id
                    ? "border-yellow-50 bg-yellow-900 text-yellow-50"
                    : "border-richblack-700 bg-richblack-800 text-richblack-300"
                } ${step > items.id && "bg-yellow-50 text-yellow-50"}} `}
              >
                {step > items.id ? (
                  <FaCheck className="font-bold text-richblack-900" />
                ) : (
                  <p>{items.id}</p>
                )}
              </div>
             
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
          </>
        ))}
      </div>
      <div className="relative mb-16 flex w-full select-none justify-between">
        {steps.map((items) => (
          <>
          <div key={items.id} className="flex min-w-[130px] flex-col items-center gap-y-2">
            <p className={`text-sm ${
                  step >= items.id ? "text-richblack-5" : "text-richblack-500"
                }`}>{items.title}</p>
          </div>
          </>
        ))}
      </div>

      {step === 1 && <CourseInformationFrom />}
      {step === 2 && <CoursePublishForm />}
      {/* {step===3&&<Publishcourse/>} */}
    </>
  );
};

export default RenderSteps;
