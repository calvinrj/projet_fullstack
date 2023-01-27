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
const Note = require("./Models/Opinion");
const Voiture = require("./Models/Voiture");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const moment = require("moment");

moment().format(" Do MMMM YYYY");

const multer = require("multer");
app.use(express.static("public"));
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
      res.redirect("http://localhost:3000/" + user.username);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/allusers", function (req, res) {
  User.find()
    .then((data) => {
      res.json({ data: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/api/note", function (req, res) {
  const Data = new Note({
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    avis: req.body.avis,
    email: req.body.email,
  });
  Data.save()
    .then(() => {
      console.log("Note saved"), res.redirect("http://localhost:3000/note");
    })
    .catch((err) => console.log(err));
});

app.get("/allnotes", function (req, res) {
  Note.find()
    .then((data) => {
      res.json({ data: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/api/voiture", function (req, res) {

  const Data = new Voiture({
    marque: req.body.marque,
    modele: req.body.modele,
    annee: req.body.annee,
    immatriculation: req.body.immatriculation,
    Description: req.body.Description,
    mise_en_service: req.body.mise_en_service,
  });
  Data.save()
    .then(() => {
      console.log("Voiture saved !");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/allcars", function (req, res) {
  Voiture.find()
    .then((data) => {
      res.json({ data: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/onecar/:id", function (req, res) {
  Voiture.findOne({ _id: req.params.id })
    .then((data) => {
      res.json({ data:data });
    })
    .catch((err) => {
        console.log(req.params);
      console.log(err);
    });
});

const server = app.listen(port, function () {
  console.log("Server listening on port " + port);
});
