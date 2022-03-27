require("dotenv").config();

const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const path = require("path");
const mongoose = require("mongoose");
const contentUploadRoutes = require("./Routes/contentUploadRoutes");
const contentRoutes = require("./Routes/contentRoutes");
const contentSortRoutes = require("./Routes/contentSortRoutes");
const cron = require("node-cron");

//DB Connection
mongoose.connect("mongodb://mongo:27017/userDB", {}, () => {
  console.log("Connected to User service DB!");
});

//Global Variables
const PORT = process.env.PORT || 8000;

//Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
//Test Route
app.get("/test", (req, res) => {
  res.json({
    code: 200,
    errCode: null,
    message: `Server Running on Port: ${PORT}`,
  });
});

app.use("/", contentUploadRoutes);
app.use("/", contentRoutes);
app.use("/", contentSortRoutes);

server.listen(PORT, () => {
  console.log(`PORT: ${PORT}`);
});
