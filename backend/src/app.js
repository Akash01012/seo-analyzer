const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const analyzeRoutes = require("./routes/analyzeRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.post("/test", (req, res) => {
  res.json({
    ok: true,
    body: req.body,
  });
});

app.use("/api", analyzeRoutes);
app.use("/api", reportRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SEO Analyzer Backend Running",
  });
});

module.exports = app;