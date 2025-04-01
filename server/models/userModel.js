const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: null,
        get: function(v) {
            return v || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.email)}&background=random`;
        }
    },
      provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
      }
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema)