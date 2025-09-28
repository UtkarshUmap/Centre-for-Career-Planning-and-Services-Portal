// utils/exportCSV.js
export const exportToCSV = (data, filename = "data.csv") => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

 
  const headers = Object.keys(data[0]);

  // Build CSV rows
  const csvRows = [
    headers.join(","),
    ...data.map(row =>
      headers.map(field => {
        let value = row[field] ?? "";

        value = value.toString().replace(/"/g, '""');
        return `"${value}"`;
      }).join(",")
    ),
  ];

  const csvString = csvRows.join("\n");


  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
