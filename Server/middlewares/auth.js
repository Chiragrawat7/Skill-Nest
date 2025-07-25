const jwt=require('jsonwebtoken');
const User=require('../models/User')
require('dotenv').config();

// auth
exports.auth=async (req,res,next) => {
    try {
        // extract token
        const token=req.cookies.token || req.header("Authorization").replace("Bearer ","") || req.body.token;

        // token present or not
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            })
        }

        // verify the token
        try {
            const jwt_secret=process.env.JWT_SECRET;
            const decode= jwt.verify(token,jwt_secret);

            console.log("JWT token decoded ",decode);

            req.user=decode;
            next();

        } catch (error) {
            console.log("error in decoding token "+error.message);
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }
        
    } catch (error) {
        console.log("error in authenticating "+error);
        return res.status(500).json({
            success:false,
            message:{info:"something Went qrong while validating the token",
                error:error.message}
        })
    }
}

// isStudent
exports.isStudent=async (req,res,next) => {
    try {
        if(req.user.accountType !== "Student" ){
            return res.status(401).json({
            success:false,
            message:"Protected Route for Only Students"
            })
        }
        
        next();
        
    } catch (error) {
        console.log("error in authenticating student "+error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// isInstructor
exports.isInstructor=async (req,res,next) => {
    try {
        if(req.user.accountType !== "Instructor" ){
            return res.status(401).json({
            success:false,
            message:"Protected Route for Only Instructors"
            })
        }
        next();
        
    } catch (error) {
        console.log("error in authenticating Instructor "+error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// isAdmin
exports.isAdmin=async (req,res,next) => {
    try {
        if(req.user.accountType !== "Admin" ){
            return res.status(401).json({
            success:false,
            message:"Protected Route for Only Admins"
            })
        }
        next();
        
    } catch (error) {
        console.log("error in authenticating Admin "+error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}