const Section=require('../models/Section');
const Cource=require('../models/Cource')

exports.createSection=async (req,res) => {
    try {
        // data fetch
        const {sectionName,courceId}=req.body;

        // data validation
        if(!sectionName || !courceId){
            return res.status(402).json({
                success:false,
                message:"all fields are required"
            })
        }
        // create section
        const newSection=await Section.create({sectionName})

        // update in the cource
        const updatedCourceDetails=await Cource.findByIdAndUpdate(courceId,
            {
                $push:{
                    courceContent:newSection._id,
                }
            },
            {new :true}
        ).populate({
            path:'courceContent',
            populate:{
                path:"subSections"
            }
        }).exec();

        // return succesfull response 
        return res.status(200).json({
            success:true,
            updatedCourceDetails,
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
        const {newSectionName,sectionId}=req.body;
        if(!newSectionName || !sectionId){
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
        return res.status(200).json({
            success:true,
            message:"section updated successfully"
        })

    } catch (error) {
        console.log("failed to update section");
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.deleteSection=async (req,res) => {
    try {
        // get id
        const {sectionId}=req.params;
        
        // validation
        if(!sectionId){
            return res.status(401).json({
                success:false,
                message:"please enter the details"
            })
        }

        // find by id and delete
        const deletedSection=await Section.findByIdAndDelete(sectionId)
        // cource me bhi update karege
        // const deletedSectionCource=await Cource.fin 
        return res.status(200).json({
            success:true,
            message:"section deleted successdfully"
        })
        
    } catch (error) {
        console.log("failed to delete section");
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}