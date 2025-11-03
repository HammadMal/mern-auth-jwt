const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authRoute = require("./Routes/AuthRoute");
const passport = require('./config/passport');
const app  = express();

const { MONGO_URL, PORT } = process.env;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get("/test", (req, res) => {
  res.send("Welcome to the Authentication API");
});

app.use(
  cors({
    origin: ["http://localhost:4000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(passport.initialize());
// app.use(passport.session());

app.use(express.json());

app.use("/", authRoute);

app.use("/auth", require("./Routes/GoogleAuthRoute"));
