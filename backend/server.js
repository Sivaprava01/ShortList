const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");

app.use("/auth", authRoutes);

const candidateRoutes = require("./routes/candidateRoutes");

app.use("/candidate", candidateRoutes);

const jobRoutes = require("./routes/jobRoutes");

app.use("/jobs", jobRoutes);

const matchRoutes = require("./routes/matchRoutes");

app.use("/match", matchRoutes);

const notificationRoutes = require("./routes/notificationRoutes");

app.use("/notifications", notificationRoutes);

const applicationRoutes = require("./routes/applicationRoutes");

app.use("/applications", applicationRoutes);

const chatRoutes = require("./routes/chatRoutes");

app.use("/chat", chatRoutes);

const journeyRoutes = require("./routes/journeyRoutes");

app.use("/journey", journeyRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected - Shortlist DB"))
.catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Shortlist API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Shortlist Server running on port ${PORT}`);
});
