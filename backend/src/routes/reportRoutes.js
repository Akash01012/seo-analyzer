const express = require("express");

const router = express.Router();

const reportController = require("../controllers/reportController");

router.get(
  "/job/:jobId",
  reportController.getJob,
);

router.get(
  "/report/:jobId",
  reportController.getReport,
);

module.exports = router;