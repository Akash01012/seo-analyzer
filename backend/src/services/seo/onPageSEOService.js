const cheerio = require("cheerio");

class OnPageSEOService {
  analyze(crawlResult) {
    const $ = cheerio.load(crawlResult.html);

    return {
      title: this.analyzeTitle(crawlResult.title),

      metaDescription: this.analyzeMetaDescription($),

      headings: this.analyzeHeadings($),

      images: this.analyzeImages($),

      canonical: this.analyzeCanonical($),

      links: this.analyzeLinks($, crawlResult.finalUrl),
    };
  }

  analyzeTitle(title) {
    const cleanTitle = (title || "").trim();

    const length = cleanTitle.length;

    let status;
    let score;
    let recommendation;

    if (length === 0) {
      status = "error";
      score = 0;
      recommendation = "Add a title tag.";
    } else if (length < 30) {
      status = "warning";
      score = 5;
      recommendation = "Increase title length to between 30 and 60 characters.";
    } else if (length > 60) {
      status = "warning";
      score = 8;
      recommendation = "Reduce title length below 60 characters.";
    } else {
      status = "pass";
      score = 10;
      recommendation = "";
    }

    return {
      text: cleanTitle,
      length,
      exists: length > 0,
      status,
      score,
      recommendation,
    };
  }

  analyzeMetaDescription($) {
    const description =
      ($('meta[name="description"]').attr("content") || "").trim();

    const length = description.length;

    let status;
    let score;
    let recommendation;

    if (length === 0) {
      status = "error";
      score = 0;
      recommendation = "Add a meta description.";
    } else if (length < 120) {
      status = "warning";
      score = 5;
      recommendation = "Increase description length to 120-160 characters.";
    } else if (length > 160) {
      status = "warning";
      score = 8;
      recommendation = "Reduce description length below 160 characters.";
    } else {
      status = "pass";
      score = 10;
      recommendation = "";
    }

    return {
      text: description,
      length,
      exists: length > 0,
      status,
      score,
      recommendation,
    };
  }

  analyzeHeadings($) {
    const h1 = $("h1").length;
    const h2 = $("h2").length;
    const h3 = $("h3").length;
    const h4 = $("h4").length;
    const h5 = $("h5").length;
    const h6 = $("h6").length;

    let status;
    let score;
    let recommendation;

    if (h1 === 0) {
      status = "error";
      score = 0;
      recommendation = "Add one H1 heading.";
    } else if (h1 > 1) {
      status = "warning";
      score = 5;
      recommendation = "Use only one H1 heading.";
    } else {
      status = "pass";
      score = 10;
      recommendation = "";
    }

    return {
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      status,
      score,
      recommendation,
    };
  }

  analyzeImages($) {
    const images = $("img");

    let missingAlt = 0;

    images.each((index, image) => {
      const alt = ($(image).attr("alt") || "").trim();

      if (!alt) {
        missingAlt++;
      }
    });

    const total = images.length;
    const withAlt = total - missingAlt;

    let status;
    let score;
    let recommendation;

    if (total === 0) {
      status = "warning";
      score = 8;
      recommendation = "No images found.";
    } else if (missingAlt === 0) {
      status = "pass";
      score = 10;
      recommendation = "";
    } else {
      status = "warning";
      score = Math.max(0, 10 - missingAlt);
      recommendation = `${missingAlt} image(s) are missing alt attributes.`;
    }

    return {
      total,
      withAlt,
      missingAlt,
      status,
      score,
      recommendation,
    };
  }

  analyzeCanonical($) {
    const canonical =
      $('link[rel="canonical" i]').attr("href")?.trim() || null;

    return {
      exists: !!canonical,
      url: canonical,
      status: canonical ? "pass" : "warning",
      score: canonical ? 10 : 5,
      recommendation: canonical ? "" : "Add a canonical URL.",
    };
  }

  analyzeLinks($, pageUrl) {
    const base = new URL(pageUrl);

    const anchors = $("a");

    let internal = 0;
    let external = 0;
    let invalid = 0;

    anchors.each((index, element) => {
      const href = $(element).attr("href");

      if (!href) return;

      try {
        const target = new URL(href, pageUrl);

        const targetRoot = this.getRootDomain(target.hostname);

        const baseRoot = this.getRootDomain(base.hostname);

        if (targetRoot === baseRoot) {
          internal++;
        } else {
          external++;
        }
      } catch (error) {
        invalid++;
      }
    });

    return {
      total: anchors.length,
      internal,
      external,
      invalid,
      status: "pass",
      score: 10,
      recommendation: "",
    };
  }

  getRootDomain(hostname) {
    return hostname.split(".").slice(-2).join(".");
  }
}

module.exports = new OnPageSEOService();