require('dotenv').config();
const express = require("express");
const Router = express.Router;
const {z} = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_USER} = require("../config");
const {userModel} = require("../db");


const userRouter = Router();

userRouter.post("/signup" , async( req , res) => {
    const requiredBody = z.object({
        email : z.string().min(3).max(100).email(),
        password : z.string().min(3).max(100),
        firstName : z.string().min(3).max(100),
        lastName : z.string().min(3).max(100)
    })

    const parseWithDataSuccess = requiredBody.safeParse(req.body);

    if(!parseWithDataSuccess.success){
        return res.status(400).json({
            message : "Incorrect Format , please check the error for the respective field",
            error : parseWithDataSuccess.error.errors
        })
    }

    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const hashedPassword = await bcrypt.hash(password , 10);

    try{
        await userModel.create({
            email : email,
            password : hashedPassword,
            firstName : firstName,
            lastName : lastName
        })

        res.json({
            message : "SignedUp SuceessFully ! "
        })
    }catch(e){
        console.log(e);
    }
}) 


userRouter.post("/login" , async(req , res) => {
    const {email , password } = req.body;

    const user = await userModel.findOne({
        email : email
    })
    
    if(!user){
        return res.status(403).json({
            message : "User does not exist ! Please Sign Uo"
        })
    }

    
        const passwordMatch = await bcrypt.compare(password , user.password)

        if(!passwordMatch){
            return res.status(403).json({
                message : "Incorrect Credentials ! Try again with correct password"
            })
        }else{
            const token = jwt.sign({
                id : user._id.toString()
            } , JWT_USER)
            res.json({
                token: token
            })
        }


})

module.exports = {
    userRouter
}