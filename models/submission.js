const mongoose = require('mongoose');
const submissionSchema  = mongoose.Schema({
    submissionTitle: {
        type: String,
        required : true,
        unique : true
    },
    submissionDescription: {
        type: String
    },
    submissionCreatedAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('submission', submissionSchema);