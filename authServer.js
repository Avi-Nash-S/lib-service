const express = require('express');
const mongoose  =require('mongoose');
const env = require('dotenv');
const cors = require('cors');
const users = require('./src/routes/users.routes');
const app = express();
env.config();
const PORT = process.env.AUTH_PORT || 4000;

const dbConnnection = mongoose.connection;
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
dbConnnection.once('open', () => console.log('DB Connection established Successfully'));

app.use([cors(), express.json()]);
app.use('/users', users);


app.get('/', function(req, res) {
    res.send('Authn Service');
});


app.listen(PORT, () => console.log('Authn Server running at PORT: ' + PORT))