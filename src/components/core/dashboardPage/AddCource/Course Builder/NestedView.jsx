import React, { useState } from "react";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import { RxDropdownMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdArrowDropDown } from "react-icons/md";
import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import SubSectionModal from "./SubSectionModal";
import { setCourse } from "../../../../../slices/courseSlice";

const NestedView = ({ handleChangeEditSectionName }) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [addSubsection, setAddSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const handleDeleteSection = async (sectionId) => {
    console.log("calling Delete Section", sectionId);
    const result = await deleteSection(
      {
        sectionId,
        courseId: course._id,
      },
      token
    );
    console.log("Deleting", result);
    if (result) {
      dispatch(setCourse(result));
    }
    setConfirmationModal(null);
  };
  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId }, token);
    if (result) {
      const updatedCouseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCouseContent };
      dispatch(setCourse(updatedCourse));
    }
    setConfirmationModal(null);
  };
  return (
    <div>
      <div
        className="rounded-lg bg-richblack-700 p-6 px-8"
        id="nestedViewContainer"
      >
        {course?.courseContent?.map((section) => (
          <details
            key={section._id}
            open
            // className="flex justify-between items-center gap-x-3 border-b-2"
          >
            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu className="text-2xl text-richblack-50" />
                <p className="font-semibold text-richblack-50">
                  {section.sectionName}
                </p>
              </div>
              <div className="flex items-center gap-x-3">
                <button
                  onClick={() =>
                    handleChangeEditSectionName(
                      section._id,
                      section.sectionName
                    )
                  }
                >
                  <MdEdit className="text-xl text-richblack-300" />
                </button>
                <button
                  onClick={() => {
                    setConfirmationModal({
                      text1: "Delete Thid Section",
                      text2: "All The Lecture in this Section will be Deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    });
                  }}
                >
                  <MdOutlineDelete className="text-xl text-richblack-300" />
                </button>
                <span className="font-medium text-richblack-300">|</span>
                <MdArrowDropDown className="text-xl text-richblack-300" />
              </div>
            </summary>
            <div className="px-6 pb-4">
              {section?.subSections.map((data, index) => (
                <div
                  onClick={() => {
                    setViewSubSection(data);
                  }}
                  key={data?._id || index}
                  className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                >
                  <div className="flex items-center gap-x-3 py-2 ">
                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-50">
                      {data.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-x-3"
                    onClick={(e)=>e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setEditSubSection({ ...data, sectionId: section._id })
                      }
                    >
                      <MdEdit className="text-xl text-richblack-300" />
                    </button>
                    <button
                      onClick={() => {
                        setConfirmationModal({
                          text1: "Delete Thid Sub Section",
                          text2: "Selected Lecture Will Be Deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        });
                      }}
                    >
                      <MdOutlineDelete className="text-xl text-richblack-300" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="mt-3 flex items-center gap-x-1 text-yellow-50"
                onClick={() => setAddSubSection(section._id)}
              >
                <IoIosAddCircleOutline className="text-lg" />
                <p>Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>
      {addSubsection ? (
        <SubSectionModal
          modalData={addSubsection}
          setModalData={setAddSubSection}
          add={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      ) : (
        <div></div>
      )}
      {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default NestedView;
