const chromeLauncher = require("chrome-launcher");

class LighthouseService {
  async analyze(url) {
    const { default: lighthouse } = await import("lighthouse");

    const chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless", "--no-sandbox"],
    });

    try {
      const runnerResult = await lighthouse(url, {
        port: chrome.port,
        output: "json",
        logLevel: "error",
      });

      const categories = runnerResult.lhr.categories;
      const audits = runnerResult.lhr.audits;

      return {
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        bestPractices: Math.round(
          categories["best-practices"].score * 100
        ),
        seo: Math.round(categories.seo.score * 100),
        metrics: {
          firstContentfulPaint:
            audits["first-contentful-paint"].displayValue,
          largestContentfulPaint:
            audits["largest-contentful-paint"].displayValue,
          speedIndex: audits["speed-index"].displayValue,
          totalBlockingTime:
            audits["total-blocking-time"].displayValue,
          cumulativeLayoutShift:
            audits["cumulative-layout-shift"].displayValue,
        },
      };
    } finally {
      await chrome.kill();
    }
  }
}

module.exports = new LighthouseService();