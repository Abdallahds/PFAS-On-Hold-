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

//////////////////////globleVariabils//////////////////////

let employeeSearch = [];


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

app.get("/manager", (req, res) => {
    res.render(__dirname + "/pages/manager")
})

app.get("/editEmployee", (req, res) => {
    res.render(__dirname + "/pages/editEmployee", { employeeSearch: employeeSearch })
})


///////////////////////post////////////////////////

app.post("/login", (req, res) => {
    userModle.findOne({ userName: req.body.userName }, (err, doc) => {
        if (doc.password == req.body.password)
            if (doc.role == "1")
                res.render(__dirname + "/pages/manager")
    })
})

app.post("/employeeAdd", (req, res) => {
    const newUser = new userModle({
        userName: req.body.newEmployeeName,
        password: "123",
        role: "employee"
    })
    newUser.save();
    res.render(__dirname + "/pages/editEmployee", { employeeSearch: employeeSearch })
})


app.post("/employeeSearch", (req, res) => {
    //     console.log(req.body.searchEmployeeName);
    userModle.find({ role: "employee", userName: { $regex: '.*' + req.body.searchEmployeeName + '.*' } }, (err, doc) => {
        // console.log(doc);        
        employeeSearch = doc;
        res.render(__dirname + "/pages/editEmployee", { employeeSearch: employeeSearch });
    });

})

