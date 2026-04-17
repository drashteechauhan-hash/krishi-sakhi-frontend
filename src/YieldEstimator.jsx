// src/components/YieldEstimator.jsx
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function YieldEstimator({ crop, landSize }) {
  const [priceData, setPriceData] = useState(null);

  useEffect(() => {
    if (!crop) return;
    fetch(`http://localhost:5050/api/market-price?commodity=${crop}&location=Kochi`)
      .then((res) => res.json())
      .then((data) => setPriceData(data))
      .catch(() => setPriceData(null));
  }, [crop]);

  if (!crop || !landSize) {
    return <p>⚠️ Please enter crop and land size to see profitability.</p>;
  }

  // --- Assumptions (can be tuned later) ---
  const avgYieldPerAcre = 10000; // kg/acre (example)
  const costPerAcre = 200000; // ₹ per acre

  // --- Live Price or fallback ---
  const livePrice = priceData?.price && priceData.price !== "N/A" ? parseFloat(priceData.price) : 20;

  // --- Calculations ---
  const totalYield = landSize * avgYieldPerAcre; // kg
  const revenue = livePrice * totalYield;
  const cost = landSize * costPerAcre;
  const profit = revenue - cost;

  const chartData = [
    { name: "Revenue", value: revenue },
    { name: "Cost", value: cost },
    { name: "Profit", value: profit },
  ];

  return (
    <div>
      <h3>📊 Profitability Analysis — {crop}</h3>
      <p>
        Live Price: {priceData?.price !== "N/A" ? `₹${livePrice}/kg` : "N/A"}{" "}
        ({priceData?.source || "No Live Data"})
      </p>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>

      <p style={{ fontWeight: "bold", color: profit > 0 ? "green" : "red" }}>
        {profit > 0 ? "✅ This crop looks profitable!" : "❌ This crop may not be profitable"}
      </p>
    </div>
  );
}

export default YieldEstimator;

