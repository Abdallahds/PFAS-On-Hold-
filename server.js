const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session")

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'));

app.listen(3000, () => {
    console.log("the server is on using port 3000");
})

//////////////////////globleVariabils//////////////////////

let employeeSearch = [];
let customerSerach = [];

////////////////////////session////////////////////////////
app.use(session({
    secret: "powerGym",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        isAuth: false
    }
}
))

/////////////////////////dataBase//////////////////////////

mongoose.connect("mongodb://localhost:27017/myGym", { useUnifiedTopology: true, useNewUrlParser: true })

const userSchema = mongoose.Schema({
    userName: String,
    password: String,
    role: String
});

const customerSchema = mongoose.Schema({
    userName: String
});

const userModle = mongoose.model("user", userSchema);

const customerModle = mongoose.model("customer", customerSchema);

/////////////////////////get//////////////////////////////

app.get("/", (req, res) => {
    console.log(req.session.cookie.isAuth);
    res.render(__dirname + "/pages/index")
})
app.get("/login", (req, res) => {
    res.render(__dirname + "/pages/login")
})

app.get("/editEmployee", (req, res) => {
    if (req.session.cookie.isAuth) {
        res.render(__dirname + "/pages/editEmployee", { employeeSearch: employeeSearch })
    }
    else {
        res.redirect("/")
    }
})

app.get("/editCustomers", (req, res) => {
    if (req.session.cookie.isAuth) {
        res.render(__dirname + "/pages/editCustomer", { customerSerach: customerSerach });
    }
    else {
        res.redirect("/")
    }
})

app.get("/customarPage", (req, res) => {
    if (req.session.cookie.isAuth) {
        res.render(__dirname + "/pages/customarPage");
    }
    else {
        res.redirect("/")
    }
})

///////////////////////post////////////////////////

app.post("/login", (req, res) => {
    userModle.findOne({ userName: req.body.userName }, (err, doc) => {
        if (doc.password == req.body.password) {
            req.session.cookie.isAuth = true;
            if (req.session.cookie.isAuth == true) {
                if (doc.role == "1")
                    res.render(__dirname + "/pages/manager")
                else if (doc.role == "employee")
                    res.render(__dirname + "/pages/reseptionEmployee", { customerSerach: customerSerach });
                else if (doc.role == "trainer")
                    res.render(__dirname + "/pages/trainerEmployee", { customerSerach: customerSerach });
            }

        }
    })
})

app.post("/employeeAdd", (req, res) => {
    const newUser = new userModle({
        userName: req.body.newEmployeeName.toLowerCase(),
        password: req.body.newEmployeePassword,
        role: req.body.employeeType
    })
    newUser.save();
    res.render(__dirname + "/pages/editEmployee", { employeeSearch: employeeSearch })
})


app.post("/employeeSearch", (req, res) => {
    userModle.find({ role: { $in: ["reseption", "trainer", "employee"] }, userName: { $regex: '.*' + req.body.searchEmployeeName.toLowerCase() + '.*' } }, (err, doc) => {
        employeeSearch = doc;
        res.render(__dirname + "/pages/editEmployee", { employeeSearch: employeeSearch });
    });
})

app.post("/customerAdd", (req, res) => {
    const newCustomer = new customerModle({
        userName: req.body.NewCustomerName
    });
    newCustomer.save();
    res.render(__dirname + "/pages/editCustomer", { customerSerach: customerSerach });
})

app.post("/customerSearch", (req, res) => {
    customerModle.find({ userName: { $regex: '.*' + req.body.searchCustomerName.toLowerCase() + '.*' } }, (err, doc) => {
        customerSerach = doc;
        res.render(__dirname + "/pages/editCustomer", { customerSerach: customerSerach });
    })
})