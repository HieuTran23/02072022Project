const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema ({
    content :{
        type : String ,
        max : 255

    },
    userId : {
        type : mongoose.Types.ObjectId ,
        ref:'user'
    }
},
{ timestamps: true }
)

module.exports = mongoose.model('comment' , CommentSchema)