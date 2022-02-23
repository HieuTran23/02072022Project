const mongoose = require('mongoose');
const academicSchema = mongoose.Schema({
    academicTitle: {
        type: String,
        required : true
    },
    academicDescription: {
        type: String,
        required : true
    },
    academicCreatedAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('academicYear', academicSchema);