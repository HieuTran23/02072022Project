const boolean = require('@hapi/joi/lib/types/boolean')
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
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    submissionId: {
        type: mongoose.Types.ObjectId,
        ref: 'submission'
    },
    comments : [{
        commentId : {
            type: mongoose.Types.ObjectId,
            ref: 'comment'
        }
    }],
    isActive: {
        type: boolean,
        default: false
    }
},
{ timestamps: true }
)

module.exports = mongoose.model('idea', ideaSchema)