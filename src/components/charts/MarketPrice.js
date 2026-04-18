import React, { useEffect, useState } from "react";
import axios from "axios";
import MarketChart from "./MarketChart";
import AnimatedCard from "../AnimatedCard/AnimatedCard";

function MarketPrice({ crop, state }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!crop || !state) return;

    axios
      .get(`https://krishi-sakhi-backend-6.onrender.com/api/market/price?crop=${crop}&state=${state}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [crop, state]);

  if (!data || data.message) return <p>No data found</p>;

  return (
    <AnimatedCard>
      <div className="market-card">
        <h3>📊 Market Price</h3>

        <p>🌾 {data.crop}</p>
        <p>💰 ₹{data.price}/quintal</p>
        <p>📍 {data.market}</p>
        <p>🗺 {data.state}</p>

        {/* 🔥 CHART */}
        

        {data.note && (
          <p style={{ color: "orange" }}>⚠ {data.note}</p>
        )}
      </div>
    </AnimatedCard>
  );
}

export default MarketPrice;