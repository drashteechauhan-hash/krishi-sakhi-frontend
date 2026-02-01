import React, { useEffect, useState } from "react";
import axios from "axios";

function MarketPrice({ commodity, location }) {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!commodity) return;

    const fetchPrice = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
  `http://localhost:5050/api/market-price?commodity=${encodeURIComponent(
    commodity
  )}&location=${encodeURIComponent(location || "Kochi")}`
);

        setPriceData(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch market price.");
        setLoading(false);
      }
    };

    fetchPrice();
  }, [commodity, location]);

  if (loading) return <p>Loading market price...</p>;
  if (error) return <p>{error}</p>;
  if (!priceData) return <p>No price data available.</p>;

  return (
    <div>
      <p>📈 Live Market Price — {commodity}</p>
      <p>
        Price: ₹{priceData.price} {priceData.unit} <br />
        Source: {priceData.source}
      </p>
    </div>
  );
}

export default MarketPrice;
