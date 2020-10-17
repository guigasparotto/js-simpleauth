const express = require("express");
const { connect } = require("mongoose");
const connectDB = require("./config/db");

// Connects to the database
connectDB();

const app = express();

// Tries to retrieve port from environment config, if unavailable uses default
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Test simple get request to index
app.get("/", (req, res) => res.json({ msg: "Welcome to the Jungle" }));
