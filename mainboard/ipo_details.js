const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/", async (req, res) => {
  const { slug } = req.query;
  if (!slug) {
    return res.status(400).json({
      success: false,
      message: "Invalid slug",
    });
  }
  try {
    const { data: html } = await axios.get(
      `https://www.chittorgarh.com/ipo/${slug}`
    );
    const $ = cheerio.load(html);
    const imageUrl = $("div.div-logo img").attr("src");
    const summary = [];
    $("div.col-md-12 p").each((i, element) => {
      summary.push($(element).text().trim());
    });

    const docsList = [];
    $("li.nav-item.dropdown:contains('Docs') ul.dropdown-menu li a").each(
      (i, element) => {
        const name = $(element).text().trim();
        const link = $(element).attr("href");
        if (name && link) {
          docsList.push({ name, link });
        }
      }
    );
    const gmpLink = $('a[title="IPO GMP"]').attr("href");

    let currentCategory = "";
    const ipoDetailsList = [];
    const promoterHolding = [];

    $("h2").each((i, element) => {
      const heading = $(element).text().trim();

      if (heading.includes("IPO Details")) {
        currentCategory = "IPO Details";
      } else if (heading.includes("IPO Promoter Holding")) {
        currentCategory = "IPO Promoter Holding";
      }

      $(element)
        .nextUntil("h2")
        .each((j, sibling) => {
          if ($(sibling).is("table")) {
            $(sibling)
              .find("tbody tr")
              .each((k, row) => {
                const columns = $(row).find("td");
                const key = $(columns[0]).text().trim();
                const value = $(columns[1])
                  .text()
                  .trim()
                  .replaceAll("[.]", "-");

                if (currentCategory === "IPO Details") {
                  ipoDetailsList.push({ key, value });
                } else if (currentCategory === "IPO Promoter Holding") {
                  promoterHolding.push({ key, value });
                }
              });
          }
        });

      currentCategory = "";
    });

    const about = [];
    $(".col-md-12.ipo-summary #ipoSummary p").each((i, element) => {
      const text = $(element).text().trim();
      if (text) {
        about.push(text);
      }
    });

    // Extract Financial Table data
    const financialData = [];
    $("#financialTable tbody tr").each((i, element) => {
      const columns = $(element).find("td");
      const key = $(columns[0]).text().trim();
      const values = [];

      $(columns)
        .slice(1)
        .each((j, valueElement) => {
          values.push($(valueElement).text().trim());
        });

      financialData.push({ key, values });
    });

    // Extract Contact Details
    const addressCard = {};
    const addressElement = $(".card:contains('Contact Details') address p");
    if (addressElement.length) {
      addressCard.name = addressElement.find("strong").first().text().trim();
      const addressLines = [];
      addressElement.contents().each((i, el) => {
        if (el.type === "text") {
          const text = $(el).text().trim();
          if (text) addressLines.push(text);
        }
      });

      // Parse additional fields
      addressCard.address = addressLines
        .slice(0, -3)
        .join(", ")
        .replaceAll(",,", ",");
      // Extracting Phone
      const phoneElement = addressElement.find("strong:contains('Phone')");
      if (phoneElement.length) {
        addressCard.phone =
          phoneElement[0].nextSibling?.nodeValue?.trim().replaceAll(": ", "") ||
          "";
      }

      // Extracting Email
      const emailElement = addressElement.find("strong:contains('Email')");
      if (emailElement.length) {
        addressCard.email =
          emailElement[0].nextSibling?.nodeValue?.trim().replaceAll(": ", "") ||
          "";
      }
      // Extracting Website
      addressCard.website = addressElement
        .find("strong:contains('Website')")
        .next()
        .attr("href");
    }

    const registrarDetails = {};
    const registrarElement = $(".card:contains('IPO Registrar') .card-body p");

    if (registrarElement.length) {
      registrarDetails.name = registrarElement
        .find("strong")
        .first()
        .text()
        .trim();

      // Extract Phone
      const phoneElement = registrarElement.find("strong:contains('Phone')");
      if (phoneElement.length) {
        registrarDetails.phone =
          phoneElement[0].nextSibling?.nodeValue?.trim().replaceAll(": ", "") ||
          "";
      }

      // Extract Email
      const emailElement = registrarElement.find("strong:contains('Email')");
      if (emailElement.length) {
        registrarDetails.email =
          emailElement[0].nextSibling?.nodeValue?.trim().replaceAll(": ", "") ||
          "";
      }

      // Extract Website
      const websiteElement = registrarElement
        .find("strong:contains('Website')")
        .next();
      if (websiteElement.length) {
        registrarDetails.website = websiteElement.attr("href") || "";
      }
    }

    const subscriptionData = await fetchSubscriptionTable(slug);
    const GmpData = await fetchGmpTable(gmpLink);
    const news = await fetchNews(slug);

    const details = {
      logo: imageUrl,
      summary: summary.slice(0, 3),
      about: about,
      docLinks: docsList,
      ipoDetails: ipoDetailsList,
      promoterHolding: promoterHolding,
      financialData: financialData,
      address: addressCard,
      registrar: registrarDetails,
      subscription: subscriptionData,
      gmpData: GmpData,
      news: news

    };

    res.json({ success: true, data: details });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the data",
    });
  }
});

async function fetchSubscriptionTable(slug) {
  const baseUrl = "https://www.chittorgarh.com/ipo_subscription";
  const url = `${baseUrl}/${slug}`;

  try {
    // Fetch HTML
    const { data: html } = await axios.get(url);

    // Load HTML into Cheerio
    const $ = cheerio.load(html);

    const tableRows = $(".table.table-condensed tbody tr");
    const subscriptionData = [];

    for (let index = 0; index < tableRows.length; index++) {
      const row = tableRows[index];
      const cells = $(row)
        .find("td")
        .map((i, cell) => $(cell).text().trim())
        .get();

      // If "Total" is found in the first cell, add the row and break the loop
      if (cells[0]?.toLowerCase().includes("total")) {
        subscriptionData.push({
          investorCategory: cells[0].replaceAll("[.]", "-"),
          subscriptionTimes: cells[1].replaceAll("[.]", "-"),
          sharesOffered: cells[2].replaceAll("[.]", "-"),
          sharesBidFor: cells[3].replaceAll("[.]", "-"),
          totalAmount: cells[4].replaceAll("[.]", "-"),
        });
        break; // Exit loop
      }

      if (cells.length > 0) {
        subscriptionData.push({
          investorCategory: cells[0].replaceAll("[.]", "-"),
          subscriptionTimes: cells[1].replaceAll("[.]", "-"),
          sharesOffered: cells[2].replaceAll("[.]", "-"),
          sharesBidFor: cells[3].replaceAll("[.]", "-"),
          totalAmount: cells[4].replaceAll("[.]", "-"),
        });
      }
    }

    const imageUrl = $("#shareImageTag").attr("src");
    const subscription = {
      subscriptionData: subscriptionData,
      image: imageUrl,
    };

    return subscription;
  } catch (error) {
    console.error("Error fetching subscription table:", error);
    return null;
  }
}

async function fetchGmpTable(url) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const h2 = $("h2:contains('Day-wise IPO')");
    const table = h2.next('table');
    const tableRows = table.find("tbody tr");
    const ipoGmpData = [];
    
    tableRows.each((index, row) => {
        const cells = $(row).find("td");
        
        const gmpDate = $(cells[0]).text().trim();
        const ipoPrice = $(cells[1]).text().trim();
        const gmp = $(cells[2]).text().trim();
        const sub2Sauda = $(cells[3]).text().trim();
        const estimatedListingPrice = $(cells[4]).text().trim();
        const lastUpdated = $(cells[5]).text().trim();
        
        // Push the data into the array
        const badge = $(cells[0]).find('span.badge');
        const badgeText = badge.text().trim();

        const gmpImg = $(cells[2]).find('img');
        const imgSrc = gmpImg.attr('src');
        let status = '';
    
        // Determine status based on image src
        if (imgSrc && imgSrc.includes('line.png')) {
            status = 'line';
        } else if (imgSrc && imgSrc.includes('arrow_up.png')) {
            status = 'up';
        } else if (imgSrc && imgSrc.includes('arrow_down.png')) {
            status = 'down';
        }
    

        ipoGmpData.push({
            gmpDate,
            ipoPrice,
            gmp,
            sub2Sauda,
            estimatedListingPrice,
            lastUpdated,
            badge: badgeText,
            status: status
        });
    });
    return ipoGmpData;
  } catch (error) {
    console.error("Error fetching subscription table:", error);
    return null;
  }
}


async function fetchNews(slug) {
  const baseUrl = "https://www.chittorgarh.com/ipo_news";
  const url = `${baseUrl}/${slug}`;
  try {
    const { data: html } = await axios.get(url);

    const $ = cheerio.load(html);
    const newsItems = [];

    $('ol.list-group li.list-group-item').each((index, element) => {
      const title = $(element).find('h2').text();
      const href = $(element).find('a').attr('href');
      const timestamp = $(element).find('p').first().text();  // First <p> tag contains timestamp
      const subtitle = $(element).find('p').last().text();  // Last <p> tag contains subtitle
      const publisher = $(element).find('small.float-end').text();
      newsItems.push({
        title,
        url: href,
        timestamp,
        subtitle,
        publishedBy: publisher
    });
  });
    return newsItems;
  } catch (error) {
    console.error("Error fetching subscription table:", error);
    return null;
  }
}

module.exports = router;
