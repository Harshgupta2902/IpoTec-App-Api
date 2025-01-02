const cors = require("cors");
const express = require("express");
const NodeCache = require("node-cache");
const cron = require("node-cron");
const cache = new NodeCache({ stdTTL: 3600 });
require("dotenv").config();
const {mainBoardNotifications,smeNotifications} = require("./firebase/checkCalenderEvents");
const { checkLatestNews } = require("./firebase/checkNews");
const { checkForLatestPost } = require("./fireba\se/checkLatestPost");




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

const defaultApi = require("./ipo/common/default");

//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////       IPO API           /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

const mainboard = require("./ipo/mainboard/current");
const sme = require("./ipo/mainboard/sme");
const details = require("./ipo/mainboard/ipo_details");

const mainSubs = require("./ipo/subscription/mainboard");
const smeSubs = require("./ipo/subscription/sme");
const gmp = require("./ipo/common/gmp");

const mainBoardCalendar = require("./ipo/calendar/mainboard_calendar");
const smeCalendar = require("./ipo/calendar/sme_calendar");

const performance = require("./ipo/ipo_history/performance");
const mostsuccessfulipo = require("./ipo/ipo_history/most_successful_ipo");
const leastsuccessfulipo = require("./ipo/ipo_history/least_successful_ipo");

const blogs = require("./ipo/common/blogs");

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////       MUTUAL FUNDS API           //////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

const topGainers = require("./mf/gainers/top_gainers");
const topLosers = require("./mf/gainers/top_losers");
const mfScreener = require("./mf/screener/screener");
const stockGainers = require("./stocks/gainers/stock_gainers");
const mfGainers = require("./stocks/gainers/mf_gainers");
const news = require("./stocks/events/news");
const search = require("./search/search");

// -------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////       IPO API           /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
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

app.use("/app/blogs", cacheMiddleware, blogs);

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////       MUTUAL FUNDS API           //////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

app.use("/app/mf/topGainers", cacheMiddleware, topGainers);
app.use("/app/mf/topLosers", cacheMiddleware, topLosers);
app.use("/app/mf/mfScreener", cacheMiddleware, mfScreener);
app.use("/app/mf/stockGainers", stockGainers);
app.use("/app/mf/mfGainers", mfGainers);
app.use("/app/mf/news", news);
app.use("/app/mf/search", search);

// -------------------------------------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/clearall", (req, res) => {
  console.log("Cache cleared successfully");
  cache.flushAll();
  res.send("Cache cleared successfully");
});

cron.schedule("0 */12 * * *", () => {
  console.log("Clearing specific cache keys every 12 hours");
  cache.flushAll();
});

cron.schedule("45 10 * * *", async () => {
  await mainBoardNotifications();
});

cron.schedule("0 12 * * *", async () => {
  await smeNotifications();
});

app.listen(3001, () => {
  console.log(`Server is running on http://localhost:${3001}/app/`);
  (async () => {
    try {
      await checkForLatestPost();
      await checkLatestNews()
      setInterval(() => {
        const currentTime = new Date().toLocaleString();
        console.log(`Checking for new posts at ${currentTime}...`);
        checkForLatestPost();
        checkLatestNews();
      }, 300000);
    } catch (error) {
      console.error("Error hitting /app/checkBlogs:", error.message);
    }

  })();
});
