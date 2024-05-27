const mongoose = require('mongoose');
// Import the models instead of the schemas
const Contact = require('./Contact');
const Transaction = require('./Transaction');

var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    accountNo:{
        type: String,
        required: true,
    },
    balance:{
        type: Number,
        required: true,
        default:0
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        default:"User"
    },
    // Use the model for contacts and transaction history
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
    transaction_history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    isBlocked:{
        type:Boolean,
        default:false
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
