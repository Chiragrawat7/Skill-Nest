const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // check if category already present of not
    const categoryPresent = await Category.findOne({ name: name });
    if (categoryPresent) {
      return res.status(401).json({
        success: false,
        message: "Category already present",
      });
    }

    // create entry in DB
    const categoryDetails = await Category.create({ name, description });
    console.log("Category details " + categoryDetails);

    return res.status(200).json({
      success: true,
      message: "Category created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all Category
exports.showAllCategories = async (req, res) => {
  try {
    const allCategorys = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.status(200).json({
      success: true,
      allCategorys,
      message: "all Category returned successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    // get category id
    const { categoryId } = req.body;

    // get cources for specified category id
    const selectedCategory = await Category.findById(categoryId)
      .populate("cources")
      .exec();

    // validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    // get cources for different categories
    const differentCategories = await Category.findById({
      _id: { $ne: categoryId },
    })
      .populate("cources")
      .exec();

    // get top 10 selling cources
    // TODO:top selling cources

    // return response
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
      },
      message: "data fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
