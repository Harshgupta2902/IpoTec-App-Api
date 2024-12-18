const axios = require("axios");
const cheerio = require("cheerio");
const { sendNotification } = require("./fcm");
const { db } = require("./firebase");

const smeNotifications = async () => {
  try {
    const today = new Date();
    const presentDate = today.getDate();
    const todayDate = `${presentDate}`;

    const smeCalendarEvents = await fetchCalendarEvents(
      "https://www.chittorgarh.com/calendar/sme-ipo-calendar/2/?month=12&year=2024"
    );

    const sme = smeCalendarEvents
      .filter((event) => event.day === todayDate && event.events.length > 0)
      .map((event) => event.events)
      .flat();

    if (sme.length > 0) {
      await sendNotificationsToUsers("Today SME IPO Events", sme);
    }
  } catch (error) {
    console.error("Error sending SME notifications:", error.message);
  }
};

const mainBoardNotifications = async () => {
  try {
    const today = new Date();
    const presentDate = today.getDate();
    const todayDate = `${presentDate}`;

    const mainboardCalendarEvents = await fetchCalendarEvents(
      "https://www.chittorgarh.com/calendar/ipo-calendar/1"
    );

    const mainboard = mainboardCalendarEvents
      .filter((event) => event.day === todayDate && event.events.length > 0)
      .map((event) => event.events)
      .flat();

    if (mainboard.length > 0) {
      await sendNotificationsToUsers("Today Mainboard IPO Events", mainboard);
    }
  } catch (error) {
    console.error("Error sending SME notifications:", error.message);
  }
};

const fetchCalendarEvents = async (url) => {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const calendarEvents = [];
    $("td.tr_box, td.tr_today").each((index, element) => {
      const day = $(element).find(".CalDate").text().trim();
      const events = [];
      $(element)
        .find("a")
        .each((i, anchor) => {
          const eventText = $(anchor).text().trim();
          const eventLink = $(anchor).attr("href");
          if (eventText) {
            events.push({ eventText, eventLink });
          }
        });
      calendarEvents.push({ day, events });
    });
    return calendarEvents;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
};

const sendNotificationsToUsers = async (title, events) => {
  const body = formatNotificationBody(events);

  const messageTemplate = {
    notification: {
      title: title,
      body: body,
    },
  };

  try {
    const usersSnapshot = await db.collection("userData").get();
    const users = usersSnapshot.docs.map((doc) => doc.data());

    for (const user of users) {
      const token = user.token;
      if (token) {
        try {
          await sendNotification(token, messageTemplate);
          console.log(
            `Notification sent to user with token: ${user.displayName}`
          );
        } catch (error) {
          console.log(
            `Error sending notification to token ${user.displayName}:`,
            error
          );
        }
      } else {
        console.log(`No FCM token found for user: ${user.uid}`);
      }
    }
  } catch (error) {
    console.error(
      "Error fetching users or sending notifications:",
      error.message
    );
  }
};

const formatNotificationBody = (events) => {
  const formattedEvents = events
    .map((event) => `📍 ${event.eventText}`)
    .join("\n");
  return formattedEvents;
};

module.exports = { smeNotifications, mainBoardNotifications };
