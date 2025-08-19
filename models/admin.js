const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    lastname: {type: String, required: true},
    firstname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: false},
    password: {type: String, require: true}
})

module.exports = mongoose.model('admin', adminSchema, 'admins')

