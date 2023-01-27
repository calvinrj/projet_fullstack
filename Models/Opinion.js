const Mongoose = require('mongoose');

const OpinionSchema= Mongoose.Schema ({
lastname: {type: String, required: true},
firstname: {type: String, required: true},
avis:{type: String, required: true},
email: {type: String, required: true},




})

module.exports= Mongoose.model("Note",OpinionSchema)