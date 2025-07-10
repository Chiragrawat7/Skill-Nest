const Cource = require("../models/Cource");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// createCource
exports.createCource = async (req, res) => {
  try {
    // fetch data
    let {
      courceName,
      courceDescription,
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
      !courceName ||
      !courceDescription ||
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

    console.log("yaha tk sb thik hai");
    // create an entry for new Cource
    const newCource = await Cource.create({
      courceName: courceName,
      courceDescription: courceDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      category: categoryDetails._id,
      thumbNail: thumbnailImage.secure_url,
      status,
      // instructions:instructions
    });
    // update new cource to instructor
    const userUpdate = await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          cources: newCource._id,
        },
      },
      { new: true }
    );

    // update the Categoryschema hw
    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          cources: newCource._id,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      newCource,
      updatedCategory,
      message: "cource created successfully",
    });
  } catch (error) {
    console.log("error in creating cource");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all cources
exports.showAllCources = async (req, res) => {
  try {
    const cources = await Cource.find(
      {},
      {
        courceName: true,
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
      cources,
      message: "All cources Fetched Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "cannot get cource data",
    });
  }
};

// get a specific cource details
exports.getCourceDetails = async (req, res) => {
  try {
    // get id
    const { courceId } = req.body;

    // find cource details
    const courceDetails = await Cource.findById(courceId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
          path: "cources",
          populate: {
            path: "courceContent",
            populate: {
              path: "subSections",
            },
          },
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courceContent",
        populate: {
          path: "subSections",
        },
      })
      .exec();

    //   validation
    if (!courceDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the cource with ${courceid}`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: courceDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
