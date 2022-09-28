const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required: true,
        minlength : 2,
        trim: true
    },
    middlename : String,
    lastname : String,
    country : String,
    phone : String,
    role: {
        type: String,
        lowercase: true,
        enum: { values: ["user","agent","admin"] , message: `{VALUE} is not supported` }
    },
    email: {
        type : String,
        required: [true, "Please provide your email"]
    },
    password:{
        type : String,
        required: [true, "Please provide your password"],
        minlength : 8
    }
});

userSchema.pre('save',async function( next ) {
    this.password = await bcrypt.hash(this.password, 12);

    next();
})

userSchema.methods.correctPassword = async function (candidatePasswd, userPasswd){
    return await bcrypt.compare(candidatePasswd, userPasswd);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
