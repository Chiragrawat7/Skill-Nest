import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsApi";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import "video-react/dist/video-react.css"; // import css
import { Player } from "video-react";
import IconBtn from "../../common/IconBtn";
import { FaCirclePlay } from "react-icons/fa6";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
  } = useSelector((state) => state.viewCourseSlice);

  const [videoData, setVideoData] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const playerRef = useRef();

  // set video details when route changes
  useEffect(() => {
    const setVideoSpecificDetails = () => {
      if (!courseSectionData.length) return;

      if (!courseId || !sectionId || !subSectionId) {
        navigate("/dashboard/enrolled-courses");
        return;
      }

      const filteredData = courseSectionData.find(
        (course) => course._id === sectionId
      );

      const filteredVideoData = filteredData?.subSections?.find(
        (data) => data._id === subSectionId
      );

      setVideoData(filteredVideoData || null);
      setVideoEnded(false);
    };

    setVideoSpecificDetails();
  }, [courseSectionData, courseEntireData, location.pathname, courseId, sectionId, subSectionId, navigate]);

  // check if current video is the very first one
  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    if (currentSectionIndex === -1) return false;

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ]?.subSections?.findIndex((data) => data._id === subSectionId);

    return currentSectionIndex === 0 && currentSubSectionIndex === 0;
  };

  // check if current video is the very last one
  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    if (currentSectionIndex === -1) return false;

    const noOfSubSections =
      courseSectionData[currentSectionIndex]?.subSections?.length || 0;

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ]?.subSections?.findIndex((data) => data._id === subSectionId);

    return (
      currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndex === noOfSubSections - 1
    );
  };

  // go to next video
  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    if (currentSectionIndex === -1) return;

    const noOfSubSections =
      courseSectionData[currentSectionIndex]?.subSections?.length || 0;

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ]?.subSections?.findIndex((data) => data._id === subSectionId);

    if (currentSubSectionIndex < noOfSubSections - 1) {
      // same section, next video
      const nextSubSectionId =
        courseSectionData[currentSectionIndex].subSections[
          currentSubSectionIndex + 1
        ]?._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      );
    } else if (currentSectionIndex < courseSectionData.length - 1) {
      // move to first video of next section
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const nextSubSectionId =
        courseSectionData[currentSectionIndex + 1].subSections[0]._id;
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      );
    }
  };

  // go to previous video
  const goToPreviousVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    if (currentSectionIndex === -1) return;

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ]?.subSections?.findIndex((data) => data._id === subSectionId);

    if (currentSubSectionIndex > 0) {
      // same section, previous video
      const previousSubSectionId =
        courseSectionData[currentSectionIndex].subSections[
          currentSubSectionIndex - 1
        ]?._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${previousSubSectionId}`
      );
    } else if (currentSectionIndex > 0) {
      // go to last video of previous section
      const previousSectionId =
        courseSectionData[currentSectionIndex - 1]._id;
      const previousSubSectionLength =
        courseSectionData[currentSectionIndex - 1].subSections.length;
      const previousSubSectionId =
        courseSectionData[currentSectionIndex - 1].subSections[
          previousSubSectionLength - 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${previousSectionId}/sub-section/${previousSubSectionId}`
      );
    }
  };

  // mark lecture completed
  const handleLectureCompletion = async () => {
    setLoading(true);
    const result = await markLectureAsComplete(
      { courseId, subSectionId },
      token
    );
    if (result?.success) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  };

  return (
    <div>
      {!videoData ? (
        <div>No Data Found</div>
      ) : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <FaCirclePlay />
          {videoEnded && (
            <div>
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  text={!loading ? "Mark Lecture as Completed" : "Loading..."}
                  onClick={handleLectureCompletion}
                />
              )}
              <IconBtn
                disabled={loading}
                text="Rewatch"
                customClasses="text-xl"
                onClick={() => {
                  if (playerRef?.current) {
                    playerRef.current.seek(0);
                    setVideoEnded(false);
                  }
                }}
              />
              {!isFirstVideo() && (
                <button
                  disabled={loading}
                  onClick={goToPreviousVideo}
                  className="blackButton"
                >
                  Prev
                </button>
              )}
              {!isLastVideo() && (
                <button
                  disabled={loading}
                  onClick={goToNextVideo}
                  className="blackButton"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </Player>
      )}
      <h1>{videoData?.title}</h1>
      <p>{videoData?.description}</p>
    </div>
  );
};

export default VideoDetails;
