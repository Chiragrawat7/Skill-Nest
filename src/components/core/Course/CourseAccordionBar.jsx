import { useEffect, useRef, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";

import CourseSubSectionAccordion from "./CourseSubSectionAccordion";

export default function CourseAccordionBar({ course, isActive, handleActive }) {
  const contentEl = useRef(null);

  const [active, setActive] = useState(false);
  const [sectionHeight, setSectionHeight] = useState(0);

  useEffect(() => {
    setActive(isActive?.includes(course._id));
  }, [isActive, course._id]);

  useEffect(() => {
    if (contentEl.current) {
      setSectionHeight(active ? contentEl.current.scrollHeight : 0);
    }
  }, [active]);

  // Use subSections array safely (note plural)
  const subSectionsArray = Array.isArray(course?.subSections) ? course.subSections : [];
  return (
    <div className="overflow-hidden border border-solid border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0">
      <div>
        <div
          className={`flex cursor-pointer items-start justify-between bg-opacity-20 px-7 py-6 transition-[0.3s]`}
          onClick={() => handleActive(course._id)}
        >
          <div className="flex items-center gap-2">
            <i className={active ? "rotate-180" : "rotate-0"}>
              <AiOutlineDown />
            </i>
            <p>{course?.sectionName || "Untitled Section"}</p>
          </div>
          <div className="space-x-4">
            <span className="text-yellow-25">
              {`${subSectionsArray.length} lecture(s)`}
            </span>
          </div>
        </div>
      </div>

      <div
        ref={contentEl}
        className="relative h-0 overflow-hidden bg-richblack-900 transition-[height] duration-[0.35s] ease-[ease]"
        style={{ height: sectionHeight }}
      >
        <div className="text-textHead flex flex-col gap-2 px-7 py-6 font-semibold">
          {subSectionsArray.length > 0 ? (
            subSectionsArray.map((subSec, i) => (
              <CourseSubSectionAccordion subSec={subSec} key={subSec._id || i} />
            ))
          ) : (
            <p className="text-sm font-normal text-richblack-200">
              No lectures added to this section.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
