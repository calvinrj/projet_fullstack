const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
const cors = require("cors");
app.use(cors());
require("dotenv").config();

const { createToken, validateToken } = require("./JWT");
const port = process.env.PORT;
const User = require("./Models/User");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

var dbURL = process.env.DATABASE_URL;
console.log(dbURL);
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect(dbURL, { useNewURLParser: true, useUnifiedTopology: true })
  .then(console.log("MongoDB connected !"))
  .catch((err) => console.log(err));

// inscription

app.post("/api/signup", function (req, res) {
  const Data = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    age: req.body.age,
    tel: req.body.tel,
    admin: false,
  });
  Data.save()
    .then(() => {
      console.log("User saved"), res.redirect("http://localhost:3000/login");
    })
    .catch((err) => console.log(err));
});

// connexion

app.post("/api/signin", function (req, res) {
  console.log(req.body);
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        res.status(404).send("user invalid !");
      }
      const accessToken = createToken(user);
      res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 12,
        httpOnly: true,
      });
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.status(404).send("Password invalid !");
      }
      res.redirect("http://localhost:3000/");
    })
    .catch((err) => {
      console.log(err);
    });
});

const server = app.listen(port, function () {
  console.log("Server listening on port " + port);
});
