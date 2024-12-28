const cheerio = require("cheerio");
const axios = require("axios");
const {sendNotificationToTopic } = require("./fcm");

let lastPost = null;

async function checkForLatestPost() {
  try {
    const response = await axios.get(
      `https://www.moneycontrol.com/news/business/ipo/page-1/`
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
      lastPost = newPost;
      const messageTemplate = {
        notification: {
          title: newPost.title,
          image: newPost.image,
          body: newPost.subtitle,
        },
      };

      try {
        const response = await sendNotificationToTopic(messageTemplate);
        console.log(`Notification sent to Topic notification`);
      } catch (error) {
        console.log(`Error sending notification`, error);
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
module.exports = { checkForLatestPost };
