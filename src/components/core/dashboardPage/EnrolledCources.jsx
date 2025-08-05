import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as profileApi from "../../../services/operations/profileApi";

import ProgressBarDefault, {
  ProgressBar as ProgressBarNamed,
} from "@ramonak/react-progress-bar";

const ProgressBarComponent = ProgressBarDefault || ProgressBarNamed || null;

const getUserEnrolledcourses =
  profileApi?.getUserEnrolledcourses ||
  profileApi?.getUserEnrolledCourses || // sometimes camelCase differs
  profileApi?.default || // default export
  profileApi; // last resort (if module itself is function in some bundlers)

const SimpleProgress = ({ value = 0, height = "8px" }) => {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div
      style={{ width: "100%", background: "#2b2b2b", height, borderRadius: 4 }}
    >
      <div
        style={{
          width: `${safeValue}%`,
          height: "100%",
          background: "#FFD60A",
          borderRadius: 4,
          transition: "width 300ms ease",
        }}
      />
    </div>
  );
};

const Enrolledcourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [enrolledcourses, setEnrolledcourses] = useState(null);

  // Optional debug logs (uncomment if you want to inspect what's undefined)
  // console.log("Resolved getUserEnrolledcourses:", getUserEnrolledcourses);
  // console.log("Resolved ProgressBarComponent:", ProgressBarComponent);

  const fetchEnrolledCourses = async () => {
    try {
      // If getUserEnrolledcourses is not a function, bail gracefully and set empty.
      if (typeof getUserEnrolledcourses !== "function") {
        console.warn(
          "getUserEnrolledcourses is not a function. Check exports in profileApi."
        );
        setEnrolledcourses([]);
        return;
      }

      const response = await getUserEnrolledcourses(token);

      // Support different shapes from API:
      // - directly returns an array
      // - returns { data: [...] }
      // - returns { courses: [...] } or { enrolledCourses: [...] }
      let data = [];
      if (Array.isArray(response)) data = response;
      else if (Array.isArray(response?.data)) data = response.data;
      else if (Array.isArray(response?.courses)) data = response.courses;
      else if (Array.isArray(response?.enrolledCourses))
        data = response.enrolledCourses;
      else data = [];

      setEnrolledcourses(data);
    } catch (error) {
      console.error("unable to fetch enrolled courses", error);
      // show empty state instead of leaving null (so UI doesn't stuck on spinner)
      setEnrolledcourses([]);
    }
  };

  useEffect(() => {
    if (token) fetchEnrolledCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const RenderProgress = ({ value }) => {
    if (ProgressBarComponent) {
      try {
        // Use the resolved ProgressBar if available
        return (
          <ProgressBarComponent
            completed={value}
            height="8px"
            isLabelVisible={false}
          />
        );
      } catch (e) {
        console.warn("ProgressBarComponent threw an error, using fallback", e);
        return <SimpleProgress value={value} />;
      }
    }
    // fallback
    return <SimpleProgress value={value} />;
  };

  return (
    <div className="flex-1 overflow-auto bg-richblack-900 text-white p-6">
      <h2 className="text-3xl text-richblack-50">Enrolled Courses</h2>

      {!enrolledcourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledcourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex rounded-t-lg bg-richblack-500 ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>

          {/* Course Cards */}
          {enrolledcourses.map((course, index, arr) => {
            const key = course?._id || course?.id || index;
            const thumbnail = course?.thumbnail || course?.thumbNail || "";
            const courseDescription = course?.courseDescription || "";
            const progress = Number(course?.progressPercentage) || 0;

            return (
              <div
                key={key}
                className={`flex items-center border border-richblack-700 ${
                  index === arr.length - 1 ? "rounded-b-lg" : ""
                }`}
              >
                <div
                  className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                  onClick={() =>
                    navigate(
                      `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                    )
                  }
                >
                  <img
                    src={thumbnail}
                    alt={course?.courseName || "course_img"}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="flex max-w-xs flex-col gap-2">
                    <p className="font-semibold">{course?.courseName}</p>
                    <p className="text-xs text-richblack-300">
                      {courseDescription.length > 50
                        ? `${courseDescription.slice(0, 50)}...`
                        : courseDescription}
                    </p>
                  </div>
                </div>

                <div className="w-1/4 px-2 py-3">
                  {course?.totalDuration || "-"}
                </div>

                <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                  <p>Progress: {progress}%</p>
                  <RenderProgress value={progress} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Enrolledcourses;
