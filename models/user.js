const mongoose = require('mongoose') ;
const Schema = mongoose.Schema

const UserSchema = new Schema({
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
    fullName:{
        type: String,
        required: true
    },
    roles: [{
        roleId: {
            type: mongoose.Types.ObjectId,
            ref: 'role',
            required: true
        }
    }],
    contact: {
        emails: [{
            email: {
                type: String,
                require: true,
                max:255
            }
        }],
        phones: [{
            phone: {
                type: String,
                max:255
            }
        }],
        addresses:[{
            street: {
                type: String,
                max:255
            },
            city: {
                type: String,
                max:255
            },
            country: {
                type: String,
                max:255
            }
        }]
    },
    createAt : {
        type : Date ,
        default : Date.now
    }
})
module.exports = mongoose.model('user',UserSchema)