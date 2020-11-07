const express = require('express');
const mongoose  =require('mongoose');
const bodyParser = require('body-parser');
const env = require('dotenv');
const cors = require('cors');
const books = require('./src/routes/books.routes');
const requests = require('./src/routes/requests.routes');
const users = require('./src/routes/users.routes');
const app = express();
env.config();
const PORT = process.env.PORT || 4001;

const dbConnnection = mongoose.connection;
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
dbConnnection.once('open', () => console.log('DB Connection established Successfully'));

app.use([cors(), bodyParser.json()]);
app.use('/books', books);
app.use('/requests', requests);
app.use('/users', users);

app.listen(PORT, () => console.log('Server running at PORT: ' + PORT))