const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const { sendNotification } = require("./fcm");
const router = express.Router();

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
    const subtitle = latestPost.find("p").text().trim();
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

    const newPost = { title, subtitle, link, image, date: formattedDate };

    if (lastPost === null || lastPost.title !== newPost.title) {
      console.log("New post detected:");
      console.log(`Title: ${newPost.title}`);
      console.log(`Title: ${newPost.subtitle}`);
      console.log(`Link: ${newPost.link}`);
      console.log(`Image: ${newPost.image}`);
      console.log(`Date: ${newPost.date}`);
      console.log("--------------------------------");

      lastPost = newPost;

      const messageTemplate = {
        notification: {
          title: newPost.title.split(" ").slice(0, 5).join(" "),
          image: newPost.image,
          body: newPost.subtitle,
        },
      };

      const token =
        "cIXwOMW3R7WFxjG2vnZpli:APA91bHmnv15oChQi9Wm-ZYFQ8bZs4XhczfXpG-FHkrsWeW50KzBzpkvM2HHzj3Ms5rq4v5dOIJXwbckIdmY2ehxyqn5FC0iQPsFoRvAI6XxTZNpKN0m2dE";
      // const token =
      //   "dMbnGjasQTeXh6xNkzFy6L:APA91bHUkd9UlCL-iI6QZUrE2O5qsZjWgxgcgyiKsZpkQJ2kCIG95xFZE_QNduu3icxPOR545vAbp6BdFAOidwRZcn555LHA-U7nqlo7_ubzKtq_o4tKBsc";

      try {
        const response = await sendNotification(token, messageTemplate);

        return {
          message: "Notification sent successfully",
          response,
        };
      } catch (error) {
        console.log("Error sending notification:", error);
        return {
          message: "Error sending notification",
          error: error.message,
        };
      }
    } else {
      console.log("No new post detected.");
      return { message: "No new post detected" };
    }
  } catch (error) {
    console.error("Error while checking for the latest post:", error.message);
    return { message: "Error checking for latest post", error: error.message };
  }
}

router.get("/", async (req, res) => {
  await checkForLatestPost();
  setInterval(() => {
    const currentTime = new Date().toLocaleString();
    console.log(`Checking for new posts at ${currentTime}...`);
    checkForLatestPost();
  }, 300000);
});

module.exports = router;
