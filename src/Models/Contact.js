const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
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
    }
});

// Export the model directly
const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;