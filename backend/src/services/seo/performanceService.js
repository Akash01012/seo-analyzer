const cheerio = require("cheerio");

class PerformanceService {
  analyze(crawlResult) {
    const $ = cheerio.load(crawlResult.html);

    const responseTime = crawlResult.responseTime;

    const pageSize = crawlResult.pageSize;

    const domNodes = $("*").length;

    const images = $("img").length;

    const scripts = $("script[src]").length;

    const stylesheets = $('link[rel="stylesheet"]').length;

    const requests =
      images +
      scripts +
      stylesheets +
      1;

    let score = 10;

    if (responseTime > 5000) {
      score -= 3;
    }
    else if (responseTime > 3000) {
      score -= 2;
    }
    else if (responseTime > 2000) {
      score -= 1;
    }

    if (domNodes > 1500) {
      score -= 2;
    }

    if (pageSize > 2 * 1024 * 1024) {
      score -= 2;
    }

    if (requests > 100) {
      score -= 2;
    }

    score = Math.max(score, 0);

    return {
      responseTime: {
        value: responseTime,
        unit: "ms",
        score: responseTime < 2000 ? 10 : score,
        status: responseTime < 3000 ? "pass" : "warning",
        recommendation:
          responseTime < 3000
            ? ""
            : "Reduce server response time."
      },

      pageSize: {
        value: pageSize,
        unit: "bytes",
        score: pageSize < 2097152 ? 10 : 7,
        status: pageSize < 2097152 ? "pass" : "warning",
        recommendation:
          pageSize < 2097152
            ? ""
            : "Reduce page size."
      },

      domSize: {
        nodes: domNodes,
        score: domNodes < 1500 ? 10 : 7,
        status: domNodes < 1500 ? "pass" : "warning",
        recommendation:
          domNodes < 1500
            ? ""
            : "Reduce DOM size."
      },

      resources: {
        images,
        scripts,
        stylesheets,
        requests,
        score: requests < 100 ? 10 : 7,
        status: requests < 100 ? "pass" : "warning",
        recommendation:
          requests < 100
            ? ""
            : "Reduce number of page resources."
      },

      score: score * 10
    };
  }
}

module.exports = new PerformanceService();