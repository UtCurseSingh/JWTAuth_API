const express = require("express");
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const connectDB = require("./database/connection");
const authController = require('./authController');
const User = require('./database/usersModel')

dotenv.config( { path: './config.env'});

const app = express();

app.use(express.json());


connectDB();

const PORT = 3000;

//Signtoken
const signToken = id => {
    return jwt.sign({ id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

//Routes
app.post('/signup', function(req,res) {
    const newUser = User.create({
        email : req.body.email,
        password : req.body.password,
        firstname : req.body.firstname,
        middlename : req.body.middlename,
        lastname : req.body.lastname,
        country : req.body.country,
        phone : req.body.phone,
        role : req.body.role
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: "success",
        token,
        data : {
            user : newUser
        }
    })
});
app.post('/login', async function(req,res,next) {
    try{

    const { email, password , role} = req.body;

    const user = await User.findOne({ email }).select('password').select('role');
    const correct = await user.correctPassword(password, user.password);
    // const correct = function(password) {
    //     if(user.password == password){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }

    if(!user || !correct || !role){
        console.log("Invalid email or password");
    }

    //Role check
    if(role != user.role){
        throw new Error('This role is not granted to the user');
        
    }

    const token = signToken(user._id) ;
    res.status(200).json({
        status: "success",
        token
    });

}catch(error){
    next(error);
}
});

app.listen(PORT, ()=> {
    console.log(`Server started at PORT: ${PORT}...`);
})