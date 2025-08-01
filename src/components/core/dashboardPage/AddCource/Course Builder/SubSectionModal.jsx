import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import { RxCross2 } from "react-icons/rx";
import Upload from "../Upload";
import IconBtn from "../../../../common/IconBtn";

const SubSectionModal = ({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    )
      return true;
    return false;
  };
  const handleEditSubSection = async () => {
    const currentValues = getValues();
    const formData = new FormData();
    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);

    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("Video", currentValues.lectureTitle);
    }
    
    setLoading(true);
    const result = await updateSubSection(formData, token);
    if (result) {
      // console.log("result", result)
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setLoading(false);
    setModalData(null);
  };

  const onSubmitHandler = async (data) => {
    if (view) return;
    else if (edit) {
      if (!isFormUpdated) {
        toast.error("NO Changes Made to the From");
      } else {
        handleEditSubSection();
      }
      return;
    } else {
      const formData = new FormData();
      formData.append("sectionId", modalData);
      formData.append("title", data.lectureTitle);
      formData.append("description", data.lectureDesc);
      formData.append("video", data.lectureVideo);
      setLoading(true);
      // API Call
      const result = await createSubSection(formData, token);
      if (result) {
        // TODO :Updation
        console.log("Result of create subsection",result)
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === modalData ? result : section
        );
        const updatedCourse = {
          ...course,
          courseContent: updatedCourseContent,
        };
        dispatch(setCourse(updatedCourse));
      }
      setModalData(null);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
             {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button
            onClick={() => {
              !loading ? setModalData(null) : {};
            }}
          >
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

         {/* Form */}
         <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="space-y-8 px-8 py-10"
      >
        <Upload
          name="lectureVideo"
          label="Lecture Video"
          register={register}
          setValue={setValue}
          errors={errors}
          video={true}
          viewData={view ? modalData.videoUrl : null}
          editData={edit ? modalData.videoUrl : null}
        />
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
            Lecture Title {!view && <sup className="text-pink-200">*</sup>}
          </label>
          <input
            id="lectureTitle"
            placeholder="Enter Lecture Title"
            {...register("lectureTitle", { required: true })}
            className="form-style mt-2 text-white focus:outline-none bg-[#2c333f]  text-base leading-6 rounded-lg p-3 shadow-[0_0_0_#0000,0_0_0_#0000,0_1px_0_0_hsla(0,0%,100%,0.5)] w-full
"
          />
          {errors.lectureTitle && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Lecture Title is Required
            </span>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
            Lecture Description{" "}
            {!view && <sup className="text-pink-200">*</sup>}
          </label>
          <textarea
            id="lectureDesc"
            placeholder="Enter Lecture Description"
            {...register("lectureDesc", { required: true })}
            className="form-style mt-2 text-white focus:outline-none bg-[#2c333f]  text-base leading-6 rounded-lg p-3 shadow-[0_0_0_#0000,0_0_0_#0000,0_1px_0_0_hsla(0,0%,100%,0.5)] w-full
               resize-x-none min-h-[130px]"
          />
          {errors.lectureDesc && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Lecture Description is Required
            </span>
          )}
        </div>
        {!view && (
          <div className="flex justify-end">
            <IconBtn
              text={loading ? "loading" : edit ? "Save Changes" : "Save"}
            />
          </div>
        )}
      </form>
      </div>
     
     
    </div>
  );
};

export default SubSectionModal;
