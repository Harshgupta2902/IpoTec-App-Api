const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();
const url = require("url");

function generateSlugFromUrl(urlString) {
  const parsedUrl = url.parse(urlString);
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, ""); // Remove leading and trailing slashes
  const parts = path.split("/");
  const lastPart = parts[parts.length - 1];
  return lastPart;
}

const monthToNumber = (month) => {
  const months = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  return months[month] || 0;
};

const sortEntriesByDate = (entries) => {
  return entries.sort((a, b) => {
    const [dayA, monthA] = a.date.split("-")[0].trim().split(" ");
    const [dayB, monthB] = b.date.split("-")[0].trim().split(" ");

    const monthNumA = monthToNumber(monthA);
    const monthNumB = monthToNumber(monthB);

    if (monthNumA !== monthNumB) {
      return monthNumB - monthNumA;
    } else {
      return parseInt(dayA) - parseInt(dayB);
    }
  });
};

router.get("/", async (req, res) => {
  try {
    const url = "https://ipowatch.in/ipo-grey-market-premium-latest-ipo-gmp/";
    const response = await axios.get(url);

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const figureContainer = $("figure.wp-block-table").first();
      const table = figureContainer.find("table");

      const Gmp = [];

      const headers = [];
      table
        .find("tr")
        .first()
        .find("td")
        .each((index, column) => {
          headers.push($(column).text().trim().toLowerCase());
        });

      table
        .find("tr")
        .slice(1)
        .each((index, row) => {
          const rowData = {};
          $(row)
            .find("td")
            .each((index, column) => {
              const header = headers[index].toLowerCase();
              const anchor = $(column).find("a");

              if (anchor.length > 0) {
                const anchorText = anchor.text().trim();
                const anchorLink = anchor.attr("href").trim();
                rowData[header] = {
                  text: anchorText,
                  link: anchorLink,
                };
              } else {
                rowData[header] = $(column).text().trim();
              }
            });

          // Safeguard check
          const companyNameObj = rowData["latest ipos"];
          if (companyNameObj && typeof companyNameObj === "object") {
            const formattedTable = {
              company_name: companyNameObj.text || "N/A",
              link: companyNameObj.link || "#",
              type: rowData["type"] || "N/A",
              ipo_gmp: rowData["ipo gmp"] === "₹-" ? null : rowData["ipo gmp"],
              price: rowData["price band"] === "₹-" ? null : rowData["price band"],
              gain:
                rowData["listinggain"] === "-%" ? null : rowData["listinggain"],
              date: rowData["ipo date"] || "N/A",
              slug: generateSlugFromUrl(companyNameObj.link || "#"),
            };
            Gmp.push(formattedTable);
          } else if (typeof companyNameObj === "string") {
            const formattedTable = {
              company_name: rowData["latest ipos"] || "N/A",
              type: rowData["type"] || "N/A",
              ipo_gmp: rowData["ipo gmp"] === "₹-" ? null : rowData["ipo gmp"],
              price: rowData["price band"] === "₹-" ? null : rowData["price band"],
              gain:
                rowData["listinggain"] === "-%" ? null : rowData["listinggain"],
              date:
                rowData["ipo date"]
                  .toLowerCase()
                  .replaceAll("soon", "Coming Soon") || "N/A",
            };
            Gmp.push(formattedTable);
          } else {
            console.error("MainIPO Name is missing or incorrect", rowData);
          }
        });

      const gmp = sortEntriesByDate(Gmp);

      res.json({ gmp });
    } else {
      throw new Error("Failed to fetch the page");
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
