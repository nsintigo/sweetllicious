const mongoose = require('mongoose')

/* Schema */
const commentsSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'comment is required'],
        min: 20,
        max: 250
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId
    }
});

/* Model */
const commenT = mongoose.model('commenT', commentsSchema)

module.exports = commenT
