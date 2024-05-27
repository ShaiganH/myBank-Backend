const {body} = require("express-validator")


const validation = [
    body('firstname').isLength({ min: 3,max:10 }).withMessage("First Name must be at least 3-10 characters long").matches(/^[a-zA-Z\s]*$/).withMessage("First Name must contain only alphabetic characters"),

    body('lastname').isLength({ min: 3,max:10 }).withMessage("Last Name must be at least 3-10 characters long").matches(/^[a-zA-Z\s]*$/).withMessage("Last Name must contain only alphabetic characters"),

    body('password').isLength({min:5}).withMessage("Password must be 5 chars long"),

    body('mobile').isLength({min:13,max:13}).isNumeric().withMessage("Not a valid Phone"),

    body('username').isEmail().withMessage("Not a valid Email")

  
]

module.exports = validation