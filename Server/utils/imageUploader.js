const cloudinary=require('cloudinary').v2

exports.uploadImageToCloudinary=async (file,folder,height,quality) => {
    const options={folder}
    if(height)
        options.height=height;
    if(quality)
        options.quality=quality;
    options.resource_type="auto";
    try {
        const res=await cloudinary.uploader.upload(file.tempFilePath, options);
        return res;
    } catch (error) {
        console.log("error while uploading")
        console.log(error)
    }
}