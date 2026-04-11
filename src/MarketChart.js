import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function MarketChart({ price }) {
  const data = [
    { day: "Mon", price: price - 100 },
    { day: "Tue", price: price - 50 },
    { day: "Wed", price: price },
    { day: "Thu", price: price + 30 },
    { day: "Fri", price: price + 10 }
  ];

  return (
    <div style={{ height: 300 }}>
      <h3>📈 Price Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MarketChart;