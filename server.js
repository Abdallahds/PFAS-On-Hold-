const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'));

app.listen(3000, () => {
    console.log("the server is on using port 3000");
})

/////////////////////////dataBase/////////////////

mongoose.connect("mongodb://localhost:27017/myGym", { useUnifiedTopology: true, useNewUrlParser: true })

const userSchema = mongoose.Schema({
    userName: String,
    password: String,
    role: String
})

const userModle = mongoose.model("user", userSchema);

/////////////////////////get//////////////////////

app.get("/", (req, res) => {
    res.render(__dirname + "/pages/index")
})
app.get("/login", (req, res) => {
    res.render(__dirname + "/pages/login")
})

app.get("/admin", (req, res) => {
    res.render(__dirname + "/pages/admin")
})


///////////////////////post////////////////////////

app.post("/login", (req, res) => {
    userModle.findOne({ userName: req.body.userName }, (err, doc) => {
        if (doc.password == req.body.password)
            if (doc.role == "1")
                res.render(__dirname + "/pages/admin")
    })
})

