const Section=require('../models/Section');
const Course=require('../models/course')
const SubSection=require('../models/SubSection')

exports.createSection=async (req,res) => {
    try {
        // data fetch
        const {sectionName,courseId}=req.body;

        // data validation
        if(!sectionName || !courseId){
            return res.status(402).json({
                success:false,
                message:"all fields are required"
            })
        }
        // create section
        const newSection=await Section.create({sectionName})

        // update in the course
        const updatedcourseDetails=await Course.findByIdAndUpdate(courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {new :true}
        ).populate({
            path:'courseContent',
            populate:{
                path:"subSections"
            }
        }).exec();

        // return succesfull response 
        return res.status(200).json({
            success:true,
            updatedcourseDetails,
            message:"section created successfully"
        })
    } catch (error) {
        console.log("failed to creeate section");
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.updateSection=async (req,res) => {
    try {
        // get data
        const {newSectionName,sectionId,courseId}=req.body;
        if(!newSectionName || !sectionId || !courseId){
            return res.status(401).json({
                success:false,
                message:"please enter the details"
            })
        }
        // update data
        const updatedSection=await Section.findByIdAndUpdate(sectionId,
            {
                sectionName:newSectionName
            },
            {new:true}
        )
        const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSections",
			},
		})
		.exec();
        return res.status(200).json({
            success:true,
            data:course,
            message:"section updated successfully"
        })

    } catch (error) {
        console.log("failed to update section",error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// DELETE a section
exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSections"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   