import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledcourses } from "../../../services/operations/profileApi";
import { ProgressBar } from "@ramonak/react-progress-bar";

const Enrolledcourses = () => {
  const { token } = useSelector((state) => state.auth);
  const [enrolledcourses, setEnrolledcourses] = useState(null);

  const getEnrolledcourses = async () => {
    try {
      const response = await getUserEnrolledcourses(token);
      console.log(response);
      setEnrolledcourses(response);
    } catch (error) {
      console.log("unable to fetch enrolled courses");
    }
  };
  useEffect(() => {
    getEnrolledcourses();
  }, []);

  return (
    <div className=" flex-1 overflow-auto bg-richblack-900">
      <h2 className="text-3xl text-richblack-50">Enrolled courses</h2>

      {!enrolledcourses ? (
        <div>Loading...</div>
      ) : !enrolledcourses.length ? (
        <div>You Have not Enrolled in any course yet</div>
      ) : (
        <div>
          <div>
            <p>course Name</p>
            <p>Durations</p>
            <p>Progress</p>
          </div>
          {/* Cards */}
          {enrolledcourses.map((course, index) => {
            <div key={index}>
              <div>
                <img src={course.thumbnail} />
                <div>
                  <p>{course.courseName}</p>
                  <p>{course.courseDescription}</p>
                </div>
              </div>
              <div>{course.totalDuration}</div>

              <div>
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLableVisible={false}
                />
              </div>
            </div>;
          })}
        </div>
      )}
    </div>
  );
};

export default Enrolledcourses;
