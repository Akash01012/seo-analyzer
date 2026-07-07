const { Worker } = require("bullmq");

const redis = require("../config/redis");

const seoAnalysisService = require("../services/seo/seoAnalysisService");

const worker = new Worker(

    "seo-analysis",

    async (job) => {

        await seoAnalysisService.run(job);

    },

    {

        connection: redis

    }

);

module.exports = worker;