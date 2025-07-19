import React, { useEffect ,useState} from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch,useSelector } from "react-redux";
import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsApi";
import { setCourse } from "../../../../../slices/courseSlice";
import { RxCross2 } from "react-icons/rx";
import Upload from '../Upload'
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
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureVideo);
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
    <div>
      <div>
        <p>{view ? "Viewing" : add ? "Adding" : "Edition"} Lecture</p>
        <button
          onClick={() => {
            !loading ? setModalData(null) : {};
          }}
        >
          <RxCross2 />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmitHandler)}>

          <Upload
            name='lectureVideo'
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view?modalData.videoUrl:null}
            editData={edit?modalData.videoUrl:null}
          />
          <div>
          <label>Lecture Title</label>
          <input
            id='lectureTitle'
            placeholder="Enter Lecture Title"
            {...register("lectureTitle",{required:true})}
            className="w-full"
          />
          {
            errors.lectureTitle&&(
                <span>Lecture Title is Required</span>
            )
          }
          </div>
          <div>
            <label>Lecture Description</label>
            <textarea
            id='lectureDesc'
            placeholder="Enter Lecture Description"
            {...register('lectureDesc',{required:true})}
            className="w-full min-h-[130px]"
            />
            {
                errors.lectureDesc&&(
                    <span>Lecture Description is Required</span>

                )
            }
          </div>
          {
            !view&&(
                <div>
                    <IconBtn
                    text={loading?'loading':edit?"Save Changes":"Save"}/>
                </div>
            )
          }
        
      </form>
      
    </div>
  );
};

export default SubSectionModal;
