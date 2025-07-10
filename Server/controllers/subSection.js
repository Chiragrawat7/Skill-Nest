const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async (req, res) => {
  try {
    // fetch data
    const { title, description, sectionId, timeDuration } = req.body;
    // extract file
    const video = req.files.video;
    // validation
    if (!title || !sectionId || !timeDuration || !description || !video) {
      return res.status(402).json({
        success: false,
        message: "all fields are required",
      });
    }
    // upload video to cloudinary
    const videoUpload = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    // create subsection
    const subSection = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: videoUpload.secure_url,
    });
    // update in section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId ,
      {
        $push: {
          subSections: subSection._id,
        },
      },
      { new: true }
    )
      .populate("subSections")
      .exec();

    console.log("Sub section details " + updatedSection);

    // return response
    return res.status(200).json({
      success: true,
      subSection,
      message: "sub section created successfully",
    });
  } catch (error) {
    console.log("failed to create sub section");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// update and delete susection
exports.updateSubSection = async (req, res) => {
  try {
    const { title, description, subSectionId } = req.body;
    const video = req.files.videoFile;
    if (!title || !description || !timeDuration || !video || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "please enter some data",
      });
    }
    const videoUrl = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    const updatedSubSection = await SubSection.findByIdAndUpdate(
      { _id: subSectionId },
      {
        title,
        description,
        timeDuration,
        videoUrl: video.secure_url,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      updatedSubSection,
      message: "sub section updated successfully",
    });
  } catch (error) {
    console.log("failed to update sub section");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteSubSection=async (req,res) => {
    try {
        const{subSectionId}=req.body;
        if(!subSectionId){
            return res.status(400).json({
                success:false,
                message:"section id not present"
            })
        }
        // also check how to delete from cloudinary
        const deletedSubSection=await SubSection.findByIdAndDelete({_id:subSectionId});
        return res.status(200).json({
            succes:true,
            message:"sub Section deleted successfully"
        })
    } catch (error) {
        console.log("failed to delete sub section");
        return res.status(500).json({
          success: false,
          message: error.message,
        });
    }
}
