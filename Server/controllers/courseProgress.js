const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourceProgress");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subSectionId } = req.body;
  const userId = req.user.id;
  try {
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "Invaid SubSection",
      });
    }
    // check for old entry
    let courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course Progress Does Not Exist",
      });
    }

    // check for  already conpleted
    else {
      if (courseProgress.completedVideos.includes(subSectionId)) {
        return res.status(400).json({
          success: false,
          message: "SubSection Already Completed",
        });
      }
      courseProgress.completedVideos.push(subSectionId);
      await courseProgress.save();
      return res.status(200).json({
        success:true,
        message:"Marked Completed",
      })
    }
  } catch (error) {
    console.log("Course Progress Error", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
