var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    username: {
        type: String, 
        unique: true,
        required: true
    },
    hash: { type: String },
    salt: { type: String }
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64)
        .toString('hex');
};

userSchema.methods.validatePassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64)
        .toString('hex');
    
    return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
    // set expiry for 7 days
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    
    var payload = {
        _id: this._id,
        username: this.username,
        exp: parseInt(expiry.getTime()/1000)
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET);
};

mongoose.model('User', userSchema);