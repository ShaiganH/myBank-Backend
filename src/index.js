const express = require("express")
const dotenv = require("dotenv").config()
const bodyParser = require("body-parser");
const connectToMongoose = require("./MongoConnection/ConnectToMongoose");
const userRouter = require("./Routes/userRouter")
const adminRouter = require("./Routes/adminRoutes")
const resetemail = require("./Routes/resetemail")

const app = express();


connectToMongoose();
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/resetpassword",resetemail);


app.listen(PORT,()=>{
    console.log(`Server started on port: ${PORT}`)
})
