const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const getAdmin = async (req,res,next)=>{

    try {
        
        const token = req.headers.authorization;


        if(!token){
          return  res.status(401).json({error:"Authenticate using a valid Bearer token"})
        }

         jwt.verify(token,process.env.JWTSECRET, async (err,decoded)=>{
            if(err){
                return res.status(403).json({error:"Invalid or expired token"}) 
            }

            req.adminId = decoded.userId


            const admin =await User.findById(req.adminId)

            if(!admin || admin.role !== "ADMIN"){
                return res.status(401).json({error:"Not Authorized as admin"})
            }

            next()
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
}

module.exports = getAdmin