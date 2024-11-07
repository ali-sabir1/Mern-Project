const express = require("express");
const Workouts = require("./routes/workouts");
const Users = require("./routes/users");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/workouts")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/workouts", Workouts);
app.use("/api/users", Users);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
