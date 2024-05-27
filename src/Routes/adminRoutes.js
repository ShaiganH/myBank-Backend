const express = require("express");
const User = require("../Models/User");
const getAdmin = require("../Middlewares/getAdmin");


const router = express.Router();

//Getting All Users
router.get("/allusers",getAdmin,async (req,res)=>{
    
    try {

        //Applying a condtion to finds only those users who do not have role admin
        const users = await User.find({role: {$ne:"ADMIN"}}).select("firstname lastname mobile accountNo balance")

        return res.json(users)

        
    } catch (error) {
        return res.status(500).json({error:"Internal Server Error"})
    }
})

//Getting specific user
router.get("/user/:id",getAdmin,async (req,res)=>{
    
    try {

        const userId = req.params.id;

        const user = await User.findById(userId).select("firstname lastname mobile accountNo balance")

        return res.json(user)

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
})

//Getting funds
router.put("/addfunds/:id",getAdmin,async (req,res)=>{
    
    try {

        const userId = req.params.id;
        const {amount} = req.body;

        await User.findByIdAndUpdate(userId,{
                $inc: {balance: amount}
            })
        

        return res.json({success:true,message:"Funds Added"})

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,error:"Internal Server Error"})
    }
})

//Block User

router.put("/blockuser/:id",getAdmin,async (req,res)=>{
    
    try {

        const userId = req.params.id;

        await User.findByIdAndUpdate(userId,{
                isBlocked:true
            })
        

        return res.json({success:true,message:"User Blocked"})

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,error:"Internal Server Error"})
    }
})


//unblock User
router.put("/unblock/:id",getAdmin,async (req,res)=>{
    
    try {

        const userId = req.params.id;

        await User.findByIdAndUpdate(userId,{
                isBlocked:false
            })
        

        return res.json({success:true,message:"User Unblocked"})

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,error:"Internal Server Error"})
    }
})




module.exports = router;