const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true},
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('article', articleSchema, 'articles')