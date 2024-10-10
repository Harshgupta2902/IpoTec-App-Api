// gmp.js

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { generateSlugFromUrl, sortEntriesByDate } = require("./utils");

const router = express.Router();
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
          const companyNameObj = rowData["upcoming ipo"];
          if (companyNameObj && typeof companyNameObj === "object") {
            const formattedTable = {
              company_name: companyNameObj.text || "N/A",
              link: companyNameObj.link || "#",
              type: rowData["type"] || "N/A",
              ipo_gmp: rowData["ipo gmp"].replaceAll("₹-", "-") || "N/A",
              price: rowData["price"] || "N/A",
              gain: rowData["gain"].replaceAll("-%", "-") || "N/A",
              date: rowData["date"] || "N/A",
              slug: generateSlugFromUrl(companyNameObj.link || "#"),
            };
            Gmp.push(formattedTable);
          } else if (typeof companyNameObj === "string") {
            const formattedTable = {
              company_name: rowData["upcoming ipo"] || "N/A",
              type: rowData["type"] || "N/A",
              ipo_gmp: rowData["ipo gmp"].replaceAll("₹-", "-") || "N/A",
              price: rowData["price"].replaceAll("₹-", "-") || "N/A",
              gain: rowData["gain"].replaceAll("-%", "-") || "N/A",
              date:
                rowData["date"]
                  .toLowerCase()
                  .replaceAll("soon", "Coming Soon") || "N/A",
            };
            Gmp.push(formattedTable);
          } else {
            console.error("MainIPO Name is missing or incorrect", rowData);
          }
        });
      const sortedGmp = sortEntriesByDate(Gmp);

      const gmp = sortedGmp.sort((a, b) => {
        if (a.date.toLowerCase().includes("coming soon")) return 1;
        if (b.date.toLowerCase().includes("coming soon")) return -1;

        // Compare by gain if both dates are valid
        const gmpA = a.gain.includes("%")
          ? parseInt(a.gain.replace("%", ""))
          : 0;
        const gmpB = b.gain.includes("%")
          ? parseInt(b.gain.replace("%", ""))
          : 0;

        return gmpB - gmpA;
      });

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
