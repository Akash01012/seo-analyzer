const express = require("express");

const router = express.Router();

const analyzeController = require("../controllers/analyzeController");

router.post("/analyze", analyzeController.createAnalysisJob);
router.get("/results/:id", analyzeController.getResult); 

module.exports = router;