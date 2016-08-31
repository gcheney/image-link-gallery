var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    author: String,
    text: String,
    createdOn: {
        type: Date,
        required: true,
        default: Date.now
    }
});

var imageSchema = new mongoose.Schema({
    url: { 
        type: String, 
        required: true 
    },
    creator: String,
    title: { 
        type: String, 
        required: true,
        default: 'Untitled'
    },
    likes: {
        type: Number,
        default: 0
    },
    description: String,
    createdOn: {
        type: Date,
        default: Date.now
    },
    unlisted: {
        type: Boolean,
        required: true,
        default: false
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('Image', imageSchema, 'images');