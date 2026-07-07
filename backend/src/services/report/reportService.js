const Report = require("../../models/Report");

class ReportService {
  calculateSectionScore(section) {
    let total = 0;
    let count = 0;

    for (const value of Object.values(section)) {
      if (!value) continue;
      if (Array.isArray(value)) continue;
      if (typeof value !== "object") continue;
      if (typeof value.score !== "number") continue;

      total += value.score;
      count++;
    }

    if (count === 0) {
      return 0;
    }

    return Math.round((total / count) * 10);
  }

  calculateOverallScore(report) {
    const onPageScore = this.calculateSectionScore(report.onPage);

    const technicalScore = this.calculateSectionScore(report.technical);

    const performanceScore = report.performance.score || 0;

    const contentScore = report.content.score || 0;

    const overallScore = Math.round(
      (
        onPageScore +
        technicalScore +
        performanceScore +
        contentScore
      ) / 4
    );

    return {
      onPageScore,
      technicalScore,
      performanceScore,
      contentScore,
      overallScore,
    };
  }

  calculateGrade(score) {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }

  buildRecommendations(report) {
    const recommendations = [];

    const modules = [
      {
        name: "On Page",
        data: report.onPage,
      },
      {
        name: "Technical",
        data: report.technical,
      },
      {
        name: "Performance",
        data: report.performance,
      },
      {
        name: "Content",
        data: report.content,
      },
    ];

    for (const module of modules) {
      for (const [key, value] of Object.entries(module.data)) {
        if (
          value &&
          value.recommendation &&
          value.recommendation.trim() !== ""
        ) {
          recommendations.push({
            category: module.name,
            check: key,
            severity:
              value.status === "error"
                ? "high"
                : value.status === "warning"
                ? "medium"
                : "low",
            message: value.recommendation,
            status: value.status,
          });
        }
      }
    }

    return recommendations;
  }

  async create({
    jobId,
    url,
    crawlResult,
    onPage,
    technical = {},
    performance = {},
    content = {},
  }) {
    const crawler = {
      title: crawlResult.title,
      finalUrl: crawlResult.finalUrl,
      statusCode: crawlResult.statusCode,
      headers: {
        contentType: crawlResult.headers["content-type"],
        contentEncoding: crawlResult.headers["content-encoding"],
        cacheControl: crawlResult.headers["cache-control"],
        contentLength: crawlResult.headers["content-length"],
        strictTransportSecurity:
          crawlResult.headers["strict-transport-security"],
        server: crawlResult.headers["server"],
      },
      responseTime: crawlResult.responseTime,
      pageSize: crawlResult.pageSize,
      timestamp: crawlResult.timestamp,
    };

    const report = {
      jobId,
      url,
      crawler,
      onPage,
      technical,
      performance,
      content,
    };

    const scores = this.calculateOverallScore(report);

    report.summary = {
      onPageScore: scores.onPageScore,
      technicalScore: scores.technicalScore,
      performanceScore: scores.performanceScore,
      contentScore: scores.contentScore,
      overallScore: scores.overallScore,
      grade: this.calculateGrade(scores.overallScore),
      executionTime: crawlResult.responseTime,
      completedAt: new Date(crawlResult.timestamp),
    };

    report.recommendations = this.buildRecommendations(report);

    return await Report.create(report);
  }
}

module.exports = new ReportService();