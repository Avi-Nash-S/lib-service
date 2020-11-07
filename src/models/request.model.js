const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const requestSchema = new Schema({
    id: {type: String},
    requestedById: {type: String},
    Owner: {type: String},
    bookId: {type: String},
    requestStatus: {type: String}, 
})

const Requests = mongoose.model('requests', requestSchema);

module.exports = Requests;