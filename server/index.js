const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors"); // ✅ NEW

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors()); // ✅ NEW
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from client folder
app.use(express.static(path.join(__dirname, "../client")));

// Booking storage (temp)
const bookingsFile = path.join(__dirname, "bookings.json");

// Route: Serve index.html from client
app.get('/', (req, res) => {
  res.send('✅ Intellex Backend is running. No frontend served from here.');
});

// Route: Serve admin.html
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin.html"));
});

// POST route: receive form data
app.post("/submit-booking", (req, res) => {
  const newBooking = req.body;
  let existingBookings = [];

  if (fs.existsSync(bookingsFile)) {
    const data = fs.readFileSync(bookingsFile, "utf8");
    existingBookings = JSON.parse(data);
  }

  existingBookings.push(newBooking);
  fs.writeFileSync(bookingsFile, JSON.stringify(existingBookings, null, 2));

  console.log("New booking received:", newBooking);
  res.send("Booking submitted successfully!");
});

// GET route: fetch bookings for admin
app.get("/get-bookings", (req, res) => {
  if (fs.existsSync(bookingsFile)) {
    const data = fs.readFileSync(bookingsFile, "utf8");
    res.json(JSON.parse(data));
  } else {
    res.json([]);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Intellex backend is running at http://localhost:${PORT}`);
});
