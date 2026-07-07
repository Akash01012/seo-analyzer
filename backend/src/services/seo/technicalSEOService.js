const axios = require("axios");
const cheerio = require("cheerio");

class TechnicalSEOService {
  async analyze(crawlResult) {
    const robots = await this.checkRobots(crawlResult.finalUrl);

    const sitemap = await this.checkSitemap(crawlResult.finalUrl);
    const $ = cheerio.load(crawlResult.html);

    return {
      https: this.checkHTTPS(crawlResult),

      redirects: this.checkRedirects(crawlResult),

      statusCode: this.checkStatusCode(crawlResult),

      contentType: this.checkContentType(crawlResult),

      compression: this.checkCompression(crawlResult),

      hsts: this.checkHSTS(crawlResult),

      urlStructure: this.checkURLStructure(crawlResult),
      mobileFriendly: this.checkMobileFriendly($),

      robots,

      sitemap,

      metaRobots: this.checkMetaRobots($),

      xRobotsTag: this.checkXRobotsTag(crawlResult),

      openGraph: this.checkOpenGraph($),

      twitterCard: this.checkTwitterCard($),

      structuredData: this.checkStructuredData($),

      favicon: this.checkFavicon($),

      canonical: this.checkCanonical($, crawlResult),
    };
  }

  checkHTTPS(crawlResult) {
    const secure = crawlResult.finalUrl.startsWith("https://");

    return {
      enabled: secure,
      status: secure ? "pass" : "error",
      score: secure ? 10 : 0,
      recommendation: secure ? "" : "Use HTTPS to secure your website.",
    };
  }

  checkRedirects(crawlResult) {
    const redirected = crawlResult.redirectCount > 0;

    let recommendation = "";

    let score = 10;

    if (crawlResult.redirectCount > 3) {
      recommendation =
        "Too many redirects were detected. Reduce redirect chains.";

      score = 5;
    }

    return {
      redirected,

      count: crawlResult.redirectCount,

      chain: crawlResult.redirects,

      from: crawlResult.originalUrl,

      to: crawlResult.finalUrl,

      status: score === 10 ? "pass" : "warning",

      score,

      recommendation,
    };
  }

  checkStatusCode(crawlResult) {
    const ok = crawlResult.statusCode === 200;

    return {
      code: crawlResult.statusCode,
      status: ok ? "pass" : "warning",
      score: ok ? 10 : 5,
      recommendation: ok ? "" : "Page should return HTTP 200.",
    };
  }

  checkContentType(crawlResult) {
    const type = crawlResult.headers["content-type"] || "";

    const html = type.includes("text/html");

    return {
      value: type,
      status: html ? "pass" : "warning",
      score: html ? 10 : 5,
      recommendation: html ? "" : "Page should return text/html content type.",
    };
  }

  checkCompression(crawlResult) {
    const encoding = crawlResult.headers["content-encoding"] || "";

    const enabled = encoding.includes("gzip") || encoding.includes("br");

    return {
      encoding,
      status: enabled ? "pass" : "warning",
      score: enabled ? 10 : 5,
      recommendation: enabled ? "" : "Enable Gzip or Brotli compression.",
    };
  }

  checkHSTS(crawlResult) {
    const header = crawlResult.headers["strict-transport-security"];

    return {
      enabled: !!header,
      value: header || null,
      status: header ? "pass" : "warning",
      score: header ? 10 : 5,
      recommendation: header ? "" : "Enable HTTP Strict Transport Security.",
    };
  }

  checkURLStructure(crawlResult) {
    const url = new URL(crawlResult.finalUrl);

    const clean = !url.search && !url.hash;

    return {
      url: crawlResult.finalUrl,
      status: clean ? "pass" : "warning",
      score: clean ? 10 : 7,
      recommendation: clean
        ? ""
        : "Avoid unnecessary query parameters and fragments.",
    };
  }

  async checkRobots(pageUrl) {
    try {
      const robotsUrl = new URL("/robots.txt", pageUrl).href;

      const response = await axios.get(robotsUrl, {
        timeout: 10000,
        validateStatus: () => true,
        headers: {
          "User-Agent": "Mozilla/5.0 SEO Analyzer",
        },
      });

      const exists =
        response.status === 200 && typeof response.data === "string";

      return {
        exists,
        url: robotsUrl,
        status: exists ? "pass" : "warning",
        score: exists ? 10 : 5,
        recommendation: exists ? "" : "Add a robots.txt file.",
      };
    } catch {
      return {
        exists: false,
        url: null,
        status: "warning",
        score: 5,
        recommendation: "Add a robots.txt file.",
      };
    }
  }

  async checkSitemap(pageUrl) {
    try {
      const sitemapUrl = new URL("/sitemap.xml", pageUrl).href;

      const response = await axios.get(sitemapUrl, {
        timeout: 10000,
        validateStatus: () => true,
        headers: {
          "User-Agent": "Mozilla/5.0 SEO Analyzer",
        },
      });

      const exists = response.status === 200;

      return {
        exists,
        url: sitemapUrl,
        status: exists ? "pass" : "warning",
        score: exists ? 10 : 5,
        recommendation: exists ? "" : "Add a sitemap.xml file.",
      };
    } catch {
      return {
        exists: false,
        url: null,
        status: "warning",
        score: 5,
        recommendation: "Add a sitemap.xml file.",
      };
    }
  }

  checkOpenGraph($) {
    const tags = {
      title: $('meta[property="og:title"]').attr("content") || null,
      description: $('meta[property="og:description"]').attr("content") || null,
      image: $('meta[property="og:image"]').attr("content") || null,
      url: $('meta[property="og:url"]').attr("content") || null,
      type: $('meta[property="og:type"]').attr("content") || null,
    };

    const count = Object.values(tags).filter(Boolean).length;

    return {
      exists: count > 0,
      tags,
      count,
      status: count >= 4 ? "pass" : "warning",
      score: count >= 4 ? 10 : count * 2,
      recommendation: count >= 4 ? "" : "Add complete Open Graph metadata.",
    };
  }

  checkTwitterCard($) {
    const tags = {
      card: $('meta[name="twitter:card"]').attr("content") || null,
      title: $('meta[name="twitter:title"]').attr("content") || null,
      description:
        $('meta[name="twitter:description"]').attr("content") || null,
      image: $('meta[name="twitter:image"]').attr("content") || null,
    };

    const count = Object.values(tags).filter(Boolean).length;

    return {
      exists: count > 0,
      tags,
      count,
      status: count >= 3 ? "pass" : "warning",
      score: count >= 3 ? 10 : count * 2,
      recommendation: count >= 3 ? "" : "Add Twitter Card metadata.",
    };
  }

  checkStructuredData($) {
    const jsonLd = $('script[type="application/ld+json"]').length;

    const microdata = $("[itemscope]").length;

    const rdfa = $("[typeof]").length;

    const total = jsonLd + microdata + rdfa;

    return {
      jsonLd,

      microdata,

      rdfa,

      total,

      exists: total > 0,

      status: total > 0 ? "pass" : "warning",

      score: total > 0 ? 10 : 5,

      recommendation: total > 0 ? "" : "Add Schema.org structured data.",
    };
  }

  checkFavicon($) {
    const favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="apple-touch-icon"]').attr("href") ||
      null;

    return {
      exists: !!favicon,

      href: favicon,

      status: favicon ? "pass" : "warning",

      score: favicon ? 10 : 5,

      recommendation: favicon ? "" : "Add a favicon for better branding.",
    };
  }

  checkMetaRobots($) {
    const content = $('meta[name="robots"]').attr("content") || null;

    if (!content) {
      return {
        exists: false,
        directives: ["index", "follow"],
        status: "pass",
        score: 10,
        recommendation: "",
      };
    }

    const directives = content
      .split(",")
      .map((item) => item.trim().toLowerCase());

    const noindex = directives.includes("noindex");
    const nofollow = directives.includes("nofollow");

    let status = "pass";
    let score = 10;
    let recommendation = "";

    if (noindex || nofollow) {
      status = "warning";
      score = 5;
      recommendation = "This page contains noindex or nofollow directives.";
    }

    return {
      exists: true,
      content,
      directives,
      noindex,
      nofollow,
      status,
      score,
      recommendation,
    };
  }

  checkXRobotsTag(crawlResult) {
    const header = crawlResult.headers["x-robots-tag"] || null;

    if (!header) {
      return {
        exists: false,
        status: "pass",
        score: 10,
        recommendation: "",
      };
    }

    const directives = header
      .split(",")
      .map((item) => item.trim().toLowerCase());

    const noindex = directives.includes("noindex");
    const nofollow = directives.includes("nofollow");

    let status = "pass";
    let score = 10;
    let recommendation = "";

    if (noindex || nofollow) {
      status = "warning";
      score = 5;
      recommendation = "X-Robots-Tag prevents indexing or following.";
    }

    return {
      exists: true,
      value: header,
      directives,
      noindex,
      nofollow,
      status,
      score,
      recommendation,
    };
  }

  checkCanonical($, crawlResult) {
  const canonicalTags = $('link[rel="canonical"]');

  const total = canonicalTags.length;

  if (total === 0) {
    return {
      exists: false,

      total,

      href: null,

      absolute: false,

      https: false,

      matchesFinalUrl: false,

      status: "warning",

      score: 5,

      recommendation: "Add a canonical URL."
    };
  }

  if (total > 1) {
    return {
      exists: true,

      total,

      href: canonicalTags.first().attr("href"),

      absolute: false,

      https: false,

      matchesFinalUrl: false,

      status: "warning",

      score: 5,

      recommendation:
        "Only one canonical tag should exist."
    };
  }

  const href = canonicalTags.first().attr("href");

  let absolute = false;

  let https = false;

  let matchesFinalUrl = false;

  try {
    const canonicalUrl = new URL(
      href,
      crawlResult.finalUrl
    );

    absolute =
      canonicalUrl.protocol === "http:" ||
      canonicalUrl.protocol === "https:";

    https =
      canonicalUrl.protocol === "https:";

    matchesFinalUrl =
      canonicalUrl.href.replace(/\/$/, "") ===
      crawlResult.finalUrl.replace(/\/$/, "");

  } catch {}

  let status = "pass";

  let score = 10;

  let recommendation = "";

  if (!absolute) {
    status = "warning";
    score = 7;
    recommendation =
      "Use an absolute canonical URL.";
  }

  if (!https) {
    status = "warning";
    score = 6;
    recommendation =
      "Canonical URL should use HTTPS.";
  }

  if (!matchesFinalUrl) {
    status = "warning";
    score = 6;
    recommendation =
      "Canonical URL should match the final URL.";
  }

  return {
    exists: true,

    total,

    href,

    absolute,

    https,

    matchesFinalUrl,

    status,

    score,

    recommendation
  };
}

checkMobileFriendly($) {
  const viewport =
    $('meta[name="viewport"]').attr("content") || "";

  const hasViewport = viewport.length > 0;

  const responsive =
    viewport.includes("width=device-width");

  const scalable =
    !viewport.includes("user-scalable=no");

  let status = "pass";

  let score = 10;

  let recommendation = "";

  if (!hasViewport) {
    status = "warning";
    score = 4;
    recommendation = "Add a viewport meta tag.";
  }
  else if (!responsive) {
    status = "warning";
    score = 7;
    recommendation =
      "Use width=device-width in the viewport meta tag.";
  }
  else if (!scalable) {
    status = "warning";
    score = 8;
    recommendation =
      "Avoid disabling zoom for accessibility.";
  }

  return {
    hasViewport,

    viewport,

    responsive,

    scalable,

    mobileFriendly:
      hasViewport && responsive,

    status,

    score,

    recommendation
  };
}

}

module.exports = new TechnicalSEOService();
