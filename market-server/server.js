// server/server.js
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

// ✅ Helper: Fetch from Agmarknet (Govt site)
async function fetchFromAgmarknet(commodityName, stateName = "Kerala", marketName = "Kochi") {
  try {
    const url = "https://agmarknet.gov.in/SearchCmmMkt.aspx";
    const resp = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(resp.data);

    let result = null;
    $("table tr").each((i, tr) => {
      const cells = $(tr).find("td").map((i, td) => $(td).text().trim()).get();
      if (cells.length >= 5) {
        const crop = cells[1].toLowerCase();
        if (crop.includes(commodityName.toLowerCase())) {
          result = {
            source: "Agmarknet",
            market: cells[0],
            commodity: cells[1],
            variety: cells[2],
            minPrice: cells[3],
            maxPrice: cells[4],
            modalPrice: cells[5] || cells[4],
            date: cells[cells.length - 1],
          };
        }
      }
    });
    return result;
  } catch (err) {
    console.error("Agmarknet fetch error:", err.message);
    return null;
  }
}

// ✅ API route for frontend
app.get("/api/market-price", async (req, res) => {
  const { commodity, location } = req.query;
  if (!commodity) return res.status(400).json({ error: "commodity required" });

  const state = "Kerala";
  const market = location || "Kochi";

  const data = await fetchFromAgmarknet(commodity, state, market);

  if (data) {
    return res.json({
      commodity: data.commodity,
      price: data.modalPrice || data.maxPrice || "N/A",
      unit: "₹/kg",
      source: data.source,
    });
  }

  // fallback
  return res.json({
    commodity,
    price: "N/A",
    unit: "₹/kg",
    source: "No Live Data",
  });
});

const PORT = 5050;
app.listen(PORT, () => console.log("✅ Market server running on", PORT));

