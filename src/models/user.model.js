const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {type: String},
  lastName: {type: String},
  userEmail: {type: String, required: true, unique: true},
  userName: {type: String, min: 2, unique: true},
  password: {type: String, required: true},
})

const User = mongoose.model('user', userSchema);

module.exports = User;