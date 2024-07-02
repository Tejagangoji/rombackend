const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const {User} = require("./models/Schema");
const app = express();

mongoose.connect("mongodb+srv://user:user@cluster0.hzfuazk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => console.log("db is running"));

app.use(cors());
app.use(express.json());

app.post('/register', async(req, res) => {
    const {name, email, password} = req.body;
    const alredyemail = await User.findOne({email: email});
    if(alredyemail) {
        return res.status(400).json("User is already there");
    }
    const user = User({
        name,
        email,
        password
    })
    await user.save();
    return res.status(200).json("Register sucessfully");
})

app.post('/login', async(req, res) => {
    const {email, password} = req.body;
    const alredyemail = await User.findOne({email: email});
    if(!alredyemail) {
        return res.status(404).json("User no found");
    }
    if(alredyemail.password === password) {
        return res.status(200).json("login sucessfully");
    }
    return res.status(405).json("password is incorrect");
})




//admin

app.post('/adminlogin', async(req, res) => {
    const {email, password} = req.body;
    if(email === "admin@gmail.com" && password === "Admin123") {
        return res.status(200).json("admin login successful");
    }
    return res.status(405).json("credentials are incorrect");
})

app.listen(5000, () => console.log("server is running"));