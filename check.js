const cheerio = require("cheerio");
const axios = require("axios");

// To keep track of the latest post
let lastPost = null;

async function checkForLatestPost(offset = 1) {
  try {
    const response = await axios.get(
      `https://www.moneycontrol.com/news/business/ipo/page-${offset}/`
    );
    const html = response.data;
    const $ = cheerio.load(html);

    const latestPost = $("#cagetory li")
      .not(".hide-mobile, .show-mobile")
      .first();

    const title = latestPost.find("h2 a").text();
    const link = latestPost.find("a").attr("href");
    let image = latestPost.find("img").attr("data");

    if (image) {
      image = image.split("?")[0];
    }

    const comment = latestPost.html().match(/<!--\s*<span>(.*?)<\/span>\s*-->/);
    const rawDate = comment ? comment[1].trim() : null;

    let formattedDate = null;
    if (rawDate) {
      const dateParts = rawDate.match(
        /(\w+) (\d+), (\d{4}) (\d{2}):(\d{2}) ([APM]+) IST/
      );

      if (dateParts) {
        const [, month, day, year, hours, minutes, ampm] = dateParts;
        const shortYear = year.slice(2);
        const shortMonth = new Date(`${month} 1`).toLocaleString("en-us", {
          month: "short",
        });
        formattedDate = `${day} ${shortMonth},${shortYear} ${hours}:${minutes} ${ampm}`;
      }
    }

    const newPost = { title, link, image, date: formattedDate };

    if (lastPost === null || lastPost.title !== newPost.title) {
      console.log("New post detected:");
      console.log(`Title: ${newPost.title}`);
      console.log(`Link: ${newPost.link}`);
      console.log(`Image: ${newPost.image}`);
      console.log(`Date: ${newPost.date}`);
      console.log("--------------------------------");

      lastPost = newPost;
    } else {
      console.log("No new post detected.");
    }
  } catch (error) {
    console.error("Error while checking for the latest post:", error.message);
  }
}

function startChecking() {
  console.log("Starting post checking...");
  checkForLatestPost();
  setInterval(() => {
    const currentTime = new Date().toLocaleString();
    console.log(`Checking for new posts at ${currentTime}...`);
    checkForLatestPost();
  }, 300000);
}

startChecking();
