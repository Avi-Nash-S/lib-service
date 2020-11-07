const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  isbn: {type: String, required: true},
  title: {type: String},
  author: {type: String},
  publisher: {type: String},
  subject: {type: String},
  available: {type: Boolean, required: true}, 
  ownerId: {type: String, required: true},
  ownerName: {type: String},
  ownerMailId: {type: String},
})

const Books = mongoose.model('books', bookSchema);

module.exports = Books;