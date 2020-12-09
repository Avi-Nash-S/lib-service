const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const env = require("dotenv");
const cors = require("cors");
const books = require("./src/routes/books.routes");
const requests = require("./src/routes/requests.routes");
const users = require("./src/routes/users.routes");
const app = express();
env.config();
// server port ID
const PORT = process.env.PORT || 4001;

// MongoDB connection
const dbConnnection = mongoose.connection;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((err) => app.response(500).send(err));
dbConnnection.once("open", () =>
  console.log("DB Connection established Successfully")
);

// Body parser and cors initialization
app.use([cors(), bodyParser.json()]);
// Books API endpoint
app.use("/books", books);
// Requests API endpoint
app.use("/requests", requests);
// Users API endpoint
app.use("/users", users);

// Default EndPoint
app.get("/", function (req, res) {
  res.send("Lib-Mate App Service");
});

// Service listener
app.listen(PORT, () => console.log("App Server running at PORT: " + PORT));
