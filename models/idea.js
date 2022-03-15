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
    files: [{
        filePath: {
            type: String
        },
        createdAt:{
            type: Date,
            default: Date.now
        }
    }],
    comments : [{
        commentId : {
            type: mongoose.Types.ObjectId,
            ref: 'comment'
        }
    }],
    isActive: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true }
)

module.exports = mongoose.model('idea', ideaSchema)