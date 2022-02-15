const mongoose = require('mongoose') ;
const Schema = mongoose.Schema

const AccountSchema = new Schema({
    username:{
        type: String ,
        require : true ,
        unique : true ,
        min : 6 ,
        max : 124
    },
    password:{ 
        type : String ,
        required : true ,
        min : 6 ,
        max : 124
    },
    email:{
        type : String ,
        unique : true ,
        min : 6 ,
        max : 124 
    },
    createAt : {
        type : Date ,
        default : Date.now
    }
})
module.exports = mongoose.model('account',AccountSchema)