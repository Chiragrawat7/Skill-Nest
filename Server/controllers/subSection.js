const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async (req, res) => {
  try {
    // fetch data
    const { title, description, sectionId} = req.body;
    // extract file
    const video = req.files.video;
    // validation
    if (!title || !sectionId|| !description || !video) {
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
    console.log("Image Uploaded to Cloudinary")
    // create subsection
    const subSection = await SubSection.create({
      title,
      timeDuration:videoUpload.duration,
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
      data:updatedSection,
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
    const { title, description, subSectionId,sectionId } = req.body;
    // const video = req.files.videoFile;
    const subSection = await SubSection.findById(subSectionId)
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
      if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()
    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSections"
    )

    console.log("updated section", updatedSection)

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.log("failed to update sub section",error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteSubSection=async (req,res) => {
    try {
        const{subSectionId,sectionId}=req.body;
        if(!subSectionId,!sectionId){
            return res.status(400).json({
                success:false,
                message:"section id not present"
            })
        }
        // also check how to delete from cloudinary
        const deletedSubSection=await SubSection.findByIdAndDelete({_id:subSectionId});
        const updatedSection=await Section.findById(sectionId).populate("subSections");
        return res.status(200).json({
            success:true,
            message:"sub Section deleted successfully",
            data:updatedSection
        })
    } catch (error) {
        console.log("failed to delete sub section");
        return res.status(500).json({
          success: false,
          message: error.message,
        });
    }
}
