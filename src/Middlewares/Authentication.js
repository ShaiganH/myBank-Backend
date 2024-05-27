const jwt = require("jsonwebtoken");


const verifyToken = ( async (req,res,next)=>{

        
        const token = req.headers.authorization;

        if(!token){
            return res.status(401).json({error:"Not valid token"})
        }

        jwt.verify(token,process.env.JWTSECRET ,(err,decoded)=>{
            if(err){
                return res.status(500).json({error:"Error Validating token"})
            }

            req.userId = decoded.userId;
            next()
        })

})

module.exports = verifyToken