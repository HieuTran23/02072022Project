const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ideaSchema = new Schema({
    title: {
        type: String,
        unique: true,
        require: true,
        max: 255
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'category'
    },
    description: {
        type: String,
    },
    content: {
        type: String
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    submission: {
        type: mongoose.Types.ObjectId,
        ref: 'submission'
    },
    lastModifiedAt: [{
        type: Date,
        default: Date.now
    }],
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('idea', ideaSchema)