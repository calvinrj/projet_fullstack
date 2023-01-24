const Mongoose = require('mongoose');

const UserSchema= Mongoose.Schema ({
username: {type: String, required: true},
email: {type: String, required: true},
password: {type: String, required: true},
age: {type: Number},
tel: {type: String},
admin:{type : Boolean}

})

module.exports= Mongoose.model("User",UserSchema)