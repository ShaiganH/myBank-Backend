const express = require("express");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const sendemail = require("../utils/email")
const router = express.Router();
const bcrypt =require("bcrypt")

router.post("/sendemail",async (req,res)=>{


    try {
        
        const {username} = req.body;

        const existUser = await User.findOne({username});

        if(!existUser){
            return res.status(404).json({error:"User doesnt exists"})
        }

        const token =jwt.sign({
            userId:existUser.id
        },process.env.JWTSECRET,
        {expiresIn:"10m"}
    );

        const resetUrl = `${req.protocol}://${req.get('host')}/resetpassword/link/${token}`;

        const message = `Dear ${existUser.firstname} \n\nWe have recieved a password reset request. Please use the below link to reset your password\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minutes. ` 
        
        await sendemail({
            email:username,
            subject:"Password Reset",
            message:message
        })

        return res.json({success:true,message:"Email Sent"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"})
    }

})


router.put("/link/:token",async (req,res)=>{
    try {
     
        const token = req.params.token;
        const {password} = req.body;

        const decoded = await jwt.verify(token, process.env.JWTSECRET);

        const saltrounds = 10;
        const salt = await bcrypt.genSalt(saltrounds);
        const hashedPass = await bcrypt.hash(password,salt)
        const user = await User.findByIdAndUpdate(decoded.userId,{
            password:hashedPass
        },{new:true});


        return res.json({user})

    } catch (error) {
        console.log(error);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(400).json({ error: "Token Expired" });
        }
        return res.status(500).json({error:"Internal server error"})
    }

})
















module.exports = router;