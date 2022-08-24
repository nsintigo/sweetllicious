const mongoose = require('mongoose')

/* Schema */
const commentsSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'comment is required'],
        min: 20,
        max: 250
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,'userId is missing'],
        ref: 'User'
    }
});

/* Model */
const comment = mongoose.model('comment', commentsSchema)

module.exports = comment
