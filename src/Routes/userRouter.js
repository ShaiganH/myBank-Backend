const express = require("express");
const { validationResult } = require("express-validator");
const router = express.Router();
const User = require("../Models/User");
const Contact = require("../Models/Contact");
const accountNoGen = require("../utils/accountNoGen");
const validation = require("../Middlewares/Validation")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../Middlewares/Authentication");
const Transaction = require("../Models/Transaction");
const limiter = require("../utils/request-limiter");


// Registration
router.post("/register", validation, async (req, res) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstname, lastname, username, mobile, password } = req.body;


        const existedUser = await User.findOne({ $or: [{ username }, { mobile }] });
        if (existedUser) {
                return res.status(400).json({ error: "User with this username already exists" });
            } 
        
        
        const accNo =await accountNoGen();

        const saltRounds =10;
        const salt = await bcrypt.genSalt(saltRounds);

        encyptedPass =await bcrypt.hash(password,salt)
      
        const newUser = await User.create({
            firstname,
            lastname,
            username,
            mobile,
            accountNo: accNo,
            password:encyptedPass
        });

        const token = jwt.sign({
            userId: newUser._id
        },
        process.env.JWTSECRET,
        {expiresIn:"1d"}
    )


        return res.status(201).json({ success: true, token });
    } catch (error) {
        console.error("Error while registering user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});




//LOGIN
router.post("/login",limiter,async (req,res)=>{

    try {
        
        const {username,password} = req.body

        const existsUser = await User.findOne({username}); 

        if(!existsUser){
            return res.status(400).json({error:"Invalid Credentials"});
        }

        if(existsUser.isBlocked === true){
            return res.status(403).json({error:"User Blocked by Admin"})
        }

        const passwordMatched = await bcrypt.compare(password,existsUser.password);

        if(!passwordMatched){
            return res.status(400).json({error:"Invalid Credentials"})
        }

        const token = jwt.sign({
            userId: existsUser._id
        },
        process.env.JWTSECRET,
        {expiresIn:"1d"}    
    )

    return res.json({success:true,
        token
    })

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
})



//FUNDS TRANSFER

router.put("/fundstransfer",verifyToken,async(req,res)=>{
    try {
        
        const userid = req.userId;

        console.log(userid)

        const {amount,accNo} = req.body

        console.log(amount,accNo)

        const reciever =await User.findOne({accountNo:accNo});

    

        if(!reciever){
            return res.status(404).json({error:"No account found with this number"})
        }

        const sender = await User.findById(userid)

        if(sender.balance<amount){
            return res.status(400).json({Error:"Not enough balance"})
        }

        await Promise.all([
            User.findByIdAndUpdate(userid, { $inc: { balance: -amount } }),
            User.findOneAndUpdate({ accountNo: accNo }, { $inc: { balance: amount } })
        ]);


        
        const senderTransaction = new Transaction({
            firstname: reciever.firstname,
            lastname: reciever.lastname,
            username: reciever.username,
            accNo: reciever.accountNo,
            amount:-amount,
            date:Date.now(),
            status:"SENT"

        });


        const recieverTransaction = new Transaction({
            firstname: sender.firstname,
            lastname: sender.lastname,
            username: sender.username,
            accNo: sender.accountNo,
            amount:amount,
            date:Date.now(),
            status:"RECIEVED"

        });


        const savedTransaction = await senderTransaction.save();
        sender.transaction_history.push(savedTransaction._id);
        await sender.save();

        const savedTransactionR = await recieverTransaction.save();
        reciever.transaction_history.push(savedTransactionR._id);
        await reciever.save();


        res.send({success:true,message:"Funds Transferred"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
})




//Add to Contacts
router.put("/addtocontacts", verifyToken, async (req, res) => {
    try {
        const userid = req.userId;
        const { accountNo } = req.body;


        const adderAcc = await User.findById(userid).populate('contacts');
        const existingContact = adderAcc.contacts.find(contact => contact.accNo === accountNo || contact.accNo === adderAcc.accountNo);

        if (existingContact) {
            return res.status(400).json({ error: "Contact already exists in the contact list" });
        }

        const added = await User.findOne({ accountNo });

        if (!added) {
            return res.status(404).json({ error: "No account found with this number" });
        }

        const newContact = new Contact({
            firstname: added.firstname,
            lastname: added.lastname,
            username: added.username,
            accNo: added.accountNo
        });

        const savedContact = await newContact.save();
        adderAcc.contacts.push(savedContact._id);
        await adderAcc.save();

        return res.json({ message: "Contact added successfully" });
    } catch (error) {
        console.error("Error adding contact:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});



router.get("/allcontacts", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

    
        const skip = (page - 1) * limit;

     
        const user = await User.findById(userId);

     
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const contacts = await Contact.find({ _id: { $in: user.contacts } })
            .skip(skip)
            .limit(limit);

 
        return res.json( contacts );

    } catch (error) {
        console.error("Error fetching contacts:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});




//Transactions By Pagination
router.get("/alltransactions", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

    
        const skip = (page - 1) * limit;

     
        const user = await User.findById(userId);

     
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const transactions = await Transaction.find({ _id: { $in: user.transaction_history
         } })
            .skip(skip)
            .limit(limit);

 
        return res.json( transactions );

    } catch (error) {
        console.error("Error fetching Transactions:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});





//Transactions By ID
router.get("/transaction/:id", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const trans_id = req.params.id

     
        const user = await User.findById(userId).populate("transaction_history")

     

        const transaction = await user.transaction_history.find(transaction => transaction._id.toString() === trans_id)

 
        return res.json( transaction );

    } catch (error) {
        console.error("Error fetching transaction:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});




module.exports = router;
