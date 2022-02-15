const mongoose = require('mongoose') ;
const Schema = mongoose.Schema

const AccountSchema = new Schema({
    username:{
        type: String ,
        require : true ,
        unique : true ,
        min : 6 ,
        max : 255
    },
    password:{ 
        type : String ,
        required : true ,
        min : 6 ,
        max : 1024
    },
    email:{
        type : String ,
        unique : true ,
        min : 6 ,
        max : 255
    },
    createAt : {
        type : Date ,
        default : Date.now
    }
})
module.exports = mongoose.model('account',AccountSchema)