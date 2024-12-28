const axios = require("axios");
const { sendNotificationToTopic, sendNotification } = require("./fcm");

let lastPostTitle = null;

async function checkLatestNews() {
  try {
    const url = `https://analyze.api.tickertape.in/v2/homepage/events?count=10&offset=0`;
    const response = await axios.get(url);
    const filteredData = response.data.data.all
      .filter((item) => item.type === "news")
      .map((item) => ({
        type: "news",
        title: item.data.headline,
        desc: item.data.summary,
        date: item.data.date,
        imageUrl: item.data.imageUrl,
        link: item.data.link,
        publisher: item.data.publisher,
        sid: item.data.stocks[0]?.sid,
        initialPrice: item.data.stocks[0]?.initialPrice,
        price: item.data.stocks[0]?.price,
        close: item.data.stocks[0]?.close,
        slug: item.data.stocks[0]?.slug,
        ticker: item.data.stocks[0]?.ticker,
        tag: item.data.tag,
      }));

    if (filteredData.length > 0) {
      const latestPost = filteredData[0];
      if (lastPostTitle !== latestPost.title) {
        console.log("New post detected:", latestPost.title);
        const cleanedBody = latestPost.desc
          .replace(/<\/?[^>]+(>|$)/g, "")
          .trim();

        const notification = {
          notification: {
            title: latestPost.title,
            body: trimTextToWordLimit(cleanedBody, 80),
          },
        };
        // const token =
        //   "c_s5b3ZDQv2X6KXB7_r-u1:APA91bEyRbTWiUDr0Edkn7R9gM8amNfZhWWobLfQnKh06E0TOZUGfYhkdjkwn7Tq3HOsk4ZhhINZiKKTVQmF4ZXZw7mJYyD_FXBvRCTOkk6dcs-1NhFPY-c";
        try {
          // await sendNotification(token, notification);
          await sendNotificationToTopic(notification);
          console.log("Notification sent successfully.");
        } catch (error) {
          console.error("Error sending notification:", error.message);
        }

        // Update last post title
        lastPostTitle = latestPost.title;
      } else {
        console.log("No new post detected.");
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

function trimTextToWordLimit(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  const trimmedText = text.substring(0, maxLength);
  const lastSpaceIndex = trimmedText.lastIndexOf(" ");

  // If a space exists, trim to the last space; otherwise, return the original text
  return lastSpaceIndex > -1
    ? trimmedText.substring(0, lastSpaceIndex) + "..."
    : trimmedText.substring(0, maxLength) + "...";
}
module.exports = { checkLatestNews };
