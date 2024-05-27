const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    accNo:{
        type: String,
        required: true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },

    status:{
        type:String
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
