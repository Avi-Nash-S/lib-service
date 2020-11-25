const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const requestSchema = new Schema({
    id: {type: String},
    requestedBy: {type: Object},
    book: {type: Object},
    requestStatus: {type: String}, 
})

const Requests = mongoose.model('requests', requestSchema);

module.exports = Requests;