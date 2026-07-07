const { Queue } = require("bullmq");

const redis = require("../config/redis");

const analysisQueue = new Queue("seo-analysis", {

    connection: redis

});

module.exports = analysisQueue;