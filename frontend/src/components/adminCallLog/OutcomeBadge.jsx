const OutcomeBadge = ({ outcome }) => {
  const styles = {
    positive: "bg-green-100 text-green-800",
    follow_up: "bg-blue-100 text-blue-800",
    connected: "bg-sky-100 text-sky-800",
    not_connected: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
        styles[outcome] || "bg-gray-100 text-gray-800"
      }`}
    >
      {outcome?.replace("_", " ")}
    </span>
  );
};

export default OutcomeBadge;
