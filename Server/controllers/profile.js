const { uploadImageToCloudinary } = require("../utils/imageUploader");
const course = require("../models/course");
const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourceProgress");
const User = require("../models/User");
const { convertSecondsToDuration } = require("../utils/secToDuration");

exports.updateProfile = async (req, res) => {
  try {
    // get data
    const { gender, dateOfBirth = "", contactNumber, about = "" } = req.body;
    // get userId
    const id = req.user.id;
    // validation
    // if(!gender || !contactNumber || !id){
    //     return res.status(402).json({
    //         success:false,
    //         message:"all fields are required"
    //     })
    // }

    const userDetails = await User.findById(id);
    // find profile
    const profileId = userDetails.additionalDetails;
    // update profile
    const profileDetails = await Profile.findById(profileId);

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    profileDetails.about = about;

    await profileDetails.save();
    const updatedUser = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    // response return krdo
    return res.status(200).json({
      success: true,
      profileDetails: updatedUser,
      message: "profile updated successfully",
    });
  } catch (error) {
    console.log("error while updating profile" + error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    // get id
    const id = req.user.id;
    // validation
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(200).json({
        success: false,
        message: "Cannot find user",
      });
    }

    // TODO: also delete from student details
    const result = await course.updateMany(
      { studentsEnrolled: id },
      {
        $pull: {
          studentsEnrolled: id,
        },
      },
      { new: true }
    );
    // delete profile
    const profileId = userDetails.additionalDetails;
    await Profile.findByIdAndDelete(profileId);

    // delete user
    await User.findByIdAndDelete(id);

    // return response
    return res.status(200).json({
      success: true,
      studentsEnrolled: result,
      message: "Profile deleted Successfully",
    });
  } catch (error) {
    console.log("error while deleting account" + error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    return res.status(200).json({
      success: true,
      userDetails,
      message: "user Details Fetched Successfully",
    });
  } catch (error) {
    console.log("error while fetching user data" + error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.updateDisplayPicture = async (req, res) => {
  try {
    const newimage = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      newimage,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      {
        image: image.secure_url,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "image uploaded successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      data: "failed to update picture",
      message: error.message,
    });
  }
};
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses", // populate courses the user enrolled in
        populate: {
          path: "courseContent", // then populate the sections inside each course
          model: "Section",
          populate: {
            path: "subSections", // if each Section has subSections
            model: "SubSection",
          },
        },
      })
      .exec();

    userDetails = userDetails.toObject();
    var SubsectionLength = 0;

    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;

      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        const subSections =
          userDetails.courses[i].courseContent[j]?.subSection || [];

        // Add durations
        totalDurationInSeconds += subSections.reduce(
          (acc, curr) => acc + parseInt(curr?.timeDuration || 0, 10),
          0
        );

        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        );

        // Add subsection count
        SubsectionLength += subSections.length;
      }

      let courseProgress = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });

      let courseProgressCount = courseProgress?.completedVideos?.length || 0;

      // ⚡ Fix: Only set 100% when BOTH are zero
      if (SubsectionLength === 0 && courseProgressCount === 0) {
        userDetails.courses[i].progressPercentage = 0;
      } else {
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(200).json({
        success: false,
        message: "could not find user",
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
