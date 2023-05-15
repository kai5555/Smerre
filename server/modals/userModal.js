var {Schema, model} = require('mongoose');

var UsersSchema = new Schema({
    username: {type: String, unique: true, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    location: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    verified: {type: Boolean, default: false},
});

UsersSchema.virtual("name").get(function () {
    return this.firstName + " " + this.lastName;
});
  

var User = model("User", UsersSchema, "Users");
module.exports = User;