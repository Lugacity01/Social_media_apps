const express = require("express");
const { connect } = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const upload = require("express-fileupload");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const routes = require("./routes/routes");
const { server, app } = require("./socket/socket");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [
      "https://social-media-apps-one.vercel.app",
      "http://localhost:5173",
    ],
  })
);
app.use(upload());

// Root Route (Fixes "Not Found = /" issue on Vercel)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// API Routes
app.use("/api", routes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// MongoDB Connection & Server Start
connect(process.env.MONGO_URL)
  .then(() =>
    server.listen(process.env.PORT, () =>
      console.log(`Server started on port ${process.env.PORT}`)
    )
  )
  .catch((err) => console.log(err));
