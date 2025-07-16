const course = require("../models/course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// createcourse
exports.createcourse = async (req, res) => {
  try {
    // fetch data
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      tag,
      status,
      instructions,
    } = req.body;
    const userId = req.user.id;
    // get thumbnail image
    const thumbnail = req.files.thumbnail;

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !category ||
      !thumbnail
    ) {
      return res.status(401).json({
        success: false,
        message: "all fields are required",
      });
    }

    if (!status || status === undefined) {
      status = "Draft";
    }
    // check for instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });
    console.log("instructor Details " + instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "instructor Details not found",
      });
    }

    // check for Category in db
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details not found",
      });
    }
    // upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    console.log("yaha tk sb thik hai create course me");
    // create an entry for new course
    const newcourse = await course.create({
      courseName: courseName,
      courseDescription: courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      category: categoryDetails._id,
      thumbNail: thumbnailImage.secure_url,
      status,
      // instructions:instructions
    });
    // update new course to instructor
    const userUpdate = await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newcourse._id,
        },
      },
      { new: true }
    );

    // update the Categoryschema hw
    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newcourse._id,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      newcourse,
      updatedCategory,
      message: "course created successfully",
    });
  } catch (error) {
    console.log("error in creating course");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all courses
exports.showAllcourses = async (req, res) => {
  try {
    const courses = await course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbNail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      courses,
      message: "All courses Fetched Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "cannot get course data",
    });
  }
};

// get a specific course details
exports.getcourseDetails = async (req, res) => {
  try {
    // get id
    const { courseId } = req.body;

    // find course details
    const courseDetails = await course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSections",
            },
          },
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSections",
        },
      })
      .exec();

    //   validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseid}`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
