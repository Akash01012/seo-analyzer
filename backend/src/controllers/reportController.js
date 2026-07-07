const Job = require("../models/Job");
const Report = require("../models/Report");

class ReportController {
  async getJob(req, res) {
    try {
      const { jobId } = req.params;

      const job = await Job.findById(jobId);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      return res.json({
        success: true,
        data: {
          id: job._id,
          status: job.status,
          progress: job.progress,
          reportId: job.reportId,
          error: job.error,
          startedAt: job.startedAt,
          completedAt: job.completedAt,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getReport(req, res) {
    try {
      const { jobId } = req.params;

      const report = await Report.findOne({
        jobId,
      });

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        });
      }

      return res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ReportController();