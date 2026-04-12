const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "https://shortlistrec.netlify.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  transports: ['websocket', 'polling']
});

app.use(cors());
app.use(express.json());

// Socket.io handler
const socketHandler = require("./socket/socketHandler");
socketHandler(io);

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

const savedJobRoutes = require("./routes/savedJobRoutes");

app.use("/saved-jobs", savedJobRoutes);

const insightsRoutes = require("./routes/insightsRoutes");

app.use("/insights", insightsRoutes);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 2,
  retryWrites: true,
  w: 'majority'
})
.then(() => console.log("MongoDB Connected - Shortlist DB"))
.catch((err) => {
  console.error("MongoDB Connection Error:", err);
  process.exit(1);
});

app.get("/", (req, res) => {
  res.send("Shortlist API Running...");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Shortlist Server running on port ${PORT}`);
});
