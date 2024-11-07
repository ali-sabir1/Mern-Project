const express = require("express");
const Workout = require("../models/workout");
const { default: mongoose } = require("mongoose");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const user_id = req.user._id;
    const workout = await Workout.find({ user_id: user_id });
    if (workout.length == 0) {
      console.log("No workout found...");
      res.send("No workout found");
      return;
    }
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  wid = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(wid)) {
    return res.status(404).json({ error: "Invalid id" });
  }
  try {
    const workout = await Workout.findById(wid);
    if (!workout) {
      console.log("No workout found...");
      res.send("No workout found");
      return;
    }
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, load, reps } = req.body;
    let emptyFields = [];
    if (!title) {
      emptyFields.push("title");
    }
    if (!load) {
      emptyFields.push("load");
    }
    if (!reps) {
      emptyFields.push("reps");
    }

    if (emptyFields.length > 0) {
      return res
        .status(400)
        .json({ error: "Please fill in all fields....", emptyFields });
    }
    const user_id = req.user._id;
    const workout = await new Workout({
      title: req.body.title,
      reps: req.body.reps,
      load: req.body.load,
      user_id: user_id,
    });
    await workout.save();
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const wid = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(wid)) {
    return res.status(404).json({ error: "Invalid id" });
  }
  try {
    const workout = await Workout.findById(wid);
    if (!workout) {
      console.log("No Workout found...");
      res.send("No Workout found");
      return;
    }

    if (req.body.title) {
      workout.title = req.body.title;
    }
    if (req.body.reps) {
      workout.reps = req.body.reps;
    }
    if (req.body.load) {
      workout.load = req.body.load;
    }
    await workout.save();
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  wid = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(wid)) {
    return res.status(404).json({ error: "Invalid id" });
  }
  try {
    const workout = await Workout.findById(wid);
    if (!workout) {
      console.log("No workout found...");
      res.send("No workout found");
      return;
    }
    await Workout.deleteOne({ _id: wid });
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
