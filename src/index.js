import Chart from "chart.js/auto";
import data from "../index.json";

const labels = [
  "index_scans_count",
  "index_scan_tuple_read",
  "index_scan_tuple_fetch",
  "index_size",
  "table_reads_index_count",
  "table_reads_seq_count",
  "table_reads_count",
  "table_writes_count",
  "table_size",
];

const createChart = (label) => {
  new Chart(document.getElementById(`${label}`), {
    type: "bar",
    data: {
      labels: data.map((row) => row.index_name),
      datasets: [
        {
          label: label,
          data: data.map((row) => row[label]),
        },
      ],
    },
  });
  console.log(
    data.map((row) => row[label]),
    label
  );
};
(async function () {
  // Generate graph for all the counts
  labels.forEach((label) => {
    createChart(label);
  });
})();
