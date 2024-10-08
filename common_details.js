const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

async function PriceBandtable(link) {
  try {
    const response = await axios.get(link);
    const html = response.data;
    const $ = cheerio.load(html);

    const tables = $("table");
    const jsonData = [];

    tables.each((index, table) => {
      const rows = $(table).find("tr");
      const tableData = [];

      rows.each((rowIndex, row) => {
        const cells = $(row).find("td, th");
        const rowObject = {};

        cells.each((cellIndex, cell) => {
          rowObject[`column${cellIndex + 1}`] = $(cell).text().trim();
        });

        if (Object.keys(rowObject).length > 0) {
          tableData.push(rowObject);
        }
      });

      jsonData.push(tableData);
    });

    return jsonData;
  } catch (error) {
    return { error: `Error fetching the page: ${error.message}` };
  }
}

async function fetchAllUlAfterHeadings(link) {
  try {
    const response = await axios.get(link);
    const html = response.data;
    const $ = cheerio.load(html);
    const headingElements = $("h2, h3");
    const results = [];

    headingElements.each((index, headingElement) => {
      const headingText = $(headingElement).text().trim();
      const ulElement = $(headingElement).next("ul");

      if (ulElement.length) {
        const ulObject = {
          heading: headingText,
          items: [],
        };

        ulElement.find("li").each((itemIndex, li) => {
          ulObject.items.push($(li).text().trim());
        });

        results.push(ulObject);
      }
    });

    const filteredUl = results.filter(
      (item) => !item.heading.includes("Review")
    );

    return filteredUl;
  } catch (error) {
    return { error: `Error fetching the page: ${error.message}` };
  }
}

router.get("/:link", async (req, res) => {
  try {
    const { link } = req.params;

    if (!link) {
      return res.status(400).json({
        error: "Please provide link",
      });
    }

    if (link.includes("undefined")) {
      return res.status(400).json({
        error: "link is undefined",
      });
    }

    const newlink = `https://ipowatch.in/${link}`;

    const priceBandResult = await PriceBandtable(newlink);
    const ulAfterHeadingsResult = await fetchAllUlAfterHeadings(newlink);

    if (ulAfterHeadingsResult.length > 0 && priceBandResult.length > 0) {
      const organizedData = {
        ulAfterHeadingsResult: ulAfterHeadingsResult,
        tables: priceBandResult,
      };

      return res.json(organizedData);
    }

    return res.status(500).json({
      error: `No Data Found: ${error.message}`,
    });
  } catch (error) {
    console.error(
      `An error occurred while fetching data for IPO: ${error.message}`
    );
    return res.status(500).json({
      error: `An error occurred while fetching data for IPO: ${error.message}`,
    });
  }
});

module.exports = router;
