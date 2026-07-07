const puppeteer = require("puppeteer");

class CrawlerService {
  async crawl(url) {
    let browser;

    const startTime = Date.now();

    try {
      const browser = await puppeteer.launch({
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
  ],
});

      const page = await browser.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
      );

      await page.setViewport({
        width: 1920,
        height: 1080,
      });

      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US,en;q=0.9",
      });

      page.setDefaultNavigationTimeout(60000);

      const response = await page.goto(url, {
        waitUntil: "networkidle2",
      });

      const redirectChain = response.request().redirectChain();

      const redirects = redirectChain.map((request, index) => ({
        step: index + 1,
        url: request.url(),
      }));

      const html = await page.content();

      const title = await page.title();

      const finalUrl = page.url();

      const statusCode = response ? response.status() : null;

      const headers = response ? response.headers() : {};

      const responseTime = Date.now() - startTime;

      const pageSize = Buffer.byteLength(html, "utf8");

      const timestamp = new Date().toISOString();

      return {
        originalUrl: url,

        finalUrl,

        title,

        html,

        statusCode,

        headers,

        responseTime,

        pageSize,

        timestamp,

        redirectCount: redirects.length,

        redirects,
      };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

module.exports = new CrawlerService();
