require("dotenv").config();

const app = require("./app");

const connectDatabase = require("./config/database");
require("./workers/analysisWorker");

const PORT = process.env.PORT || 5000;

async function startServer() {

    await connectDatabase();

    app.listen(PORT, () => {

        console.log(`Server running on port ${PORT}`);

    });

}

startServer();