const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'));

app.listen(3000, () => {
    console.log("the server is on using port 3000");
})

app.get("/", (req, res) => {
    res.render(__dirname + "/pages/index")
})
app.get("/login", (req, res) => {
    res.render(__dirname + "/pages/login")
})

app.get("/admin", (req, res) => {
    res.render(__dirname + "/pages/admin")
})

app.post("/login", (req, res) => {
    console.log(req.body.userName)
    console.log(req.body.password);
    res.render(__dirname + "/pages/login")
})

