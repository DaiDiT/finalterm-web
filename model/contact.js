const mongoose = require('mongoose')

const Contact = mongoose.model('Contact', {
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    birthdate: {
        type: String,
    },
    relation: {
        type: String,
    },
    address: {
        type: String,
    },
    note: {
        type: String,
    }
})

module.exports = Contact