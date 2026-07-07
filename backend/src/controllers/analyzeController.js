const validator = require("validator");

const Job = require("../models/Job");
const Report = require("../models/Report");
const analysisQueue = require("../jobs/analysisQueue");

const { v4: uuidv4 } = require("uuid");

exports.createAnalysisJob = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,

        message: "Website URL is required",
      });
    }

    if (
      !validator.isURL(url, {
        require_protocol: true,
      })
    ) {
      return res.status(400).json({
        success: false,

        message: "Invalid URL",
      });
    }

    const job = await Job.create({
      url,

      status: "pending",

      progress: 0,
    });

    await analysisQueue.add(
      "website-analysis",

      {
        jobId: job._id.toString(),

        url,
      },
    );

    return res.status(201).json({
      success: true,

      jobId: job._id,

      status: "pending",

      message: "Analysis queued successfully",
    });
    
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: "Internal Server Error",
    });
  }
};


exports.getJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getResult = async (req, res) => {
  try {
    const report = await Report.findOne({
      jobId: req.params.id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
