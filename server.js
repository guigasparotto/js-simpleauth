const express = require("express");
const { connect } = require("mongoose");
const connectDB = require("./config/db");

// Connects to the database
connectDB();

const app = express();
app.use(express.json({ extended: false }));

// Tries to retrieve port from environment config, if unavailable uses default
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Define other routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
