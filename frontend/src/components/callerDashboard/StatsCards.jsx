import React from "react";

const StatsCard = ({ title, value, color }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4 flex flex-col items-center justify-center border-l-4" style={{ borderColor: color }}>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-2" style={{ color }}>{value}</p>
    </div>
  );
};

export default StatsCard;
