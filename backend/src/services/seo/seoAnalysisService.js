const Job = require("../../models/Job");
const crawlerService = require("../crawler/crawlerService");
const onPageSEOService = require("./onPageSEOService");
const technicalSEOService = require("./technicalSEOService");
const reportService = require("../report/reportService");
const performanceService = require("./performanceService");
const contentAnalysisService = require("./contentAnalysisService");
const lighthouseService = require("./lighthouseService");

class SEOAnalysisService {
  async run(job) {
    try {
      console.log("Starting SEO Analysis");

      await Job.findByIdAndUpdate(job.data.jobId, {
        status: "running",
        progress: 10,
        startedAt: new Date(),
      });

      console.log("SEO Analysis Started");

      const crawlResult = await crawlerService.crawl(job.data.url);

      console.log("========== CRAWLER RESULT ==========");

      console.log("Title:", crawlResult.title);
      console.log("Status:", crawlResult.statusCode);
      console.log("Final URL:", crawlResult.finalUrl);
      console.log("HTML Length:", crawlResult.html.length);
      console.log("Response Time:", crawlResult.responseTime);
      console.log("Page Size:", crawlResult.pageSize);
      console.log("Timestamp:", crawlResult.timestamp);

      console.log("====================================");

      const onPageSEO = onPageSEOService.analyze(crawlResult);

      console.log("========== ON PAGE SEO ==========");

      console.log(JSON.stringify(onPageSEO, null, 2));

      console.log("=================================");

      const technicalSEO = await technicalSEOService.analyze(crawlResult);

      console.log("========== TECHNICAL SEO ==========");

      console.log(JSON.stringify(technicalSEO, null, 2));

      console.log("===================================");

      const performance = performanceService.analyze(crawlResult);

      console.log("========== PERFORMANCE ==========");

      console.log(JSON.stringify(performance, null, 2));

      console.log("=================================");

      const content = contentAnalysisService.analyze(crawlResult);

      console.log("========== CONTENT ANALYSIS ==========");

      console.log(JSON.stringify(content, null, 2));

      console.log("======================================");

      if (process.env.ENABLE_LIGHTHOUSE === "true") {
        const lighthouse = await lighthouseService.analyze(
          crawlResult.finalUrl,
        );

        performance.lighthouse = lighthouse;

        console.log("========== LIGHTHOUSE ==========");

        console.log(JSON.stringify(lighthouse, null, 2));

        console.log("================================");
      }

      const report = await reportService.create({
        jobId: job.data.jobId,

        url: job.data.url,

        crawlResult,

        onPage: onPageSEO,

        technical: technicalSEO,

        performance,
        content,
      });

      console.log(
        "Report Saved:",

        report._id,
      );

      await Job.findByIdAndUpdate(job.data.jobId, {
        status: "completed",
        progress: 100,
        reportId: report._id,
        completedAt: new Date(),
      });

      console.log("SEO Analysis Completed");
    } catch (error) {
      console.error(error);

      await Job.findByIdAndUpdate(
        job.data.jobId,

        {
          status: "failed",

          error: error.message,

          completedAt: new Date(),
        },
      );
    }
  }
}

module.exports = new SEOAnalysisService();
