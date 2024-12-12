const cors = require("cors");
const express = require("express");
const NodeCache = require("node-cache");
const axios = require('axios');
const cron = require("node-cron");
const cache = new NodeCache({ stdTTL: 3600 });
require("dotenv").config();

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`Cache hit for ${key}`);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(cachedResponse);
  }

  console.log(`Cache miss for ${key}`);
  res.originalSend = res.send;
  res.send = (body) => {
    cache.set(key, body);
    console.log(`Cache set for ${key}`);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.originalSend(body);
  };
  next();
};

const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );

  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
// -------------------------------------------------------------------------------------------------------

const defaultApi = require("./common/default");

const mainboard = require("./mainboard/current");
const sme = require("./mainboard/sme");
const details = require("./mainboard/ipo_details");

const mainSubs = require("./subscription/mainboard");
const smeSubs = require("./subscription/sme");
const gmp = require("./common/gmp");
  
const mainBoardCalendar = require("./calendar/mainboard_calendar");
const smeCalendar = require("./calendar/sme_calendar");

const performance = require("./ipo_history/performance");
const mostsuccessfulipo = require("./ipo_history/most_successful_ipo");
const leastsuccessfulipo = require("./ipo_history/least_successful_ipo");

const checkBlogs = require("./firebase/check");

const blogs = require("./common/blogs");

// -------------------------------------------------------------------------------------------------------

app.use("/app/default", cacheMiddleware, defaultApi);

app.use("/app/mainboard", cacheMiddleware, mainboard);
app.use("/app/sme", cacheMiddleware, sme);
app.use("/app/details", cacheMiddleware, details);

app.use("/app/mainSubs", cacheMiddleware, mainSubs);
app.use("/app/smeSubs", cacheMiddleware, smeSubs);

app.use("/app/gmp", cacheMiddleware, gmp);

app.use("/app/mainBoardCalendar", cacheMiddleware, mainBoardCalendar);
app.use("/app/smeCalendar", cacheMiddleware, smeCalendar);

app.use("/app/performance", cacheMiddleware, performance);
app.use("/app/mostsuccessfulipo", cacheMiddleware, mostsuccessfulipo);
app.use("/app/leastsuccessfulipo", cacheMiddleware, leastsuccessfulipo);

app.use("/app/checkBlogs", cacheMiddleware, checkBlogs);

app.use("/app/blogs", cacheMiddleware, blogs);

// -------------------------------------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/clearCache", (req, res) => {
  console.log("Cache cleared successfully");
  cache.flushAll();
  res.send("Cache cleared successfully");
});

cron.schedule("0 */12 * * *", () => {
  console.log("Clearing specific cache keys every 12 hours");
  cache.flushAll();
});

app.listen(3001, () => {
  console.log(`Server is running on http://localhost:${3001}/app/`);
  (async () => {
    try {
        // const response = await axios.get(`http://localhost:${3001}/app/checkBlogs`);
        // console.log('API Response:', response.data);
    } catch (error) {
        console.error('Error hitting /app/checkBlogs:', error.message);
    }
})();

});
