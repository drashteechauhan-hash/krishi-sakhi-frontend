import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Wheat", value: 40 },
  { name: "Rice", value: 30 },
  { name: "Maize", value: 20 },
  { name: "Others", value: 10 }
];

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];

function CropPieChart() {
  return (
    <div style={{ height: 300 }}>
      <h3>🌾 Crop Distribution</h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CropPieChart;