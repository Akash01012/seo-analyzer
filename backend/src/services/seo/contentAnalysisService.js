const cheerio = require("cheerio");

class ContentAnalysisService {
  analyze(crawlResult) {
    const $ = cheerio.load(crawlResult.html);

    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    const contentLength = this.checkContentLength($, bodyText);

    const keywordAnalysis = this.checkKeywordAnalysis(
      bodyText,
      crawlResult.title
    );

    const readability = this.checkReadability(bodyText);

    const headingHierarchy = this.checkHeadingHierarchy($);

    const score = Math.round(
      (
        contentLength.score +
        keywordAnalysis.score +
        readability.score +
        headingHierarchy.score
      ) / 4 * 10
    );

    return {
      contentLength,
      keywordAnalysis,
      readability,
      headingHierarchy,
      score
    };
  }

  checkContentLength($, text) {
    const wordCount = text
      .split(/\s+/)
      .filter(Boolean).length;

    const paragraphs = $("p").length;

    let score = 10;
    let status = "pass";
    let recommendation = "";

    if (wordCount < 300) {
      score = 6;
      status = "warning";
      recommendation =
        "Increase page content for better SEO.";
    }

    return {
      wordCount,
      paragraphs,
      status,
      score,
      recommendation
    };
  }

  checkKeywordAnalysis(text, title) {
    const keywords = title
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3);

    const frequency = {};

    const lowerText = text.toLowerCase();

    keywords.forEach(keyword => {
      const matches = lowerText.match(
        new RegExp(keyword, "g")
      );

      frequency[keyword] = matches
        ? matches.length
        : 0;
    });

    return {
      keywords,
      frequency,
      status: "pass",
      score: 10,
      recommendation: ""
    };
  }

  checkReadability(text) {
    const words = text
      .split(/\s+/)
      .filter(Boolean);

    const sentences = text
      .split(/[.!?]+/)
      .filter(Boolean);

    const averageSentenceLength =
      sentences.length === 0
        ? 0
        : Math.round(words.length / sentences.length);

    let score = 10;
    let status = "pass";
    let recommendation = "";

    if (averageSentenceLength > 25) {
      score = 7;
      status = "warning";
      recommendation =
        "Use shorter sentences.";
    }

    return {
      words: words.length,
      sentences: sentences.length,
      averageSentenceLength,
      status,
      score,
      recommendation
    };
  }

  checkHeadingHierarchy($) {
    const h1 = $("h1").length;
    const h2 = $("h2").length;
    const h3 = $("h3").length;

    let score = 10;
    let status = "pass";
    let recommendation = "";

    if (h1 !== 1) {
      score = 6;
      status = "warning";
      recommendation =
        "Use exactly one H1 heading.";
    }

    return {
      h1,
      h2,
      h3,
      status,
      score,
      recommendation
    };
  }
}

module.exports = new ContentAnalysisService();