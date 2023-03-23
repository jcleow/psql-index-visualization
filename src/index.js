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
  labels.forEach((label) => {
    if (label !== "index_size" && label !== "table_size") {
      createChart(label);
    }
  });
})();

// \copy (SELECT row_to_json(q) FROM
//     (
//         SELECT
//             idstat.relname AS TABLE_NAME,
//             indexrelname AS index_name,
//             idstat.idx_scan AS index_scans_count,
//             idstat.idx_tup_read as index_scan_tuple_read,
//             idstat.idx_tup_fetch as index_scan_tuple_fetch,
//             pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
//             tabstat.idx_scan AS table_reads_index_count,
//             tabstat.seq_scan AS table_reads_seq_count,
//             tabstat.seq_scan + tabstat.idx_scan AS table_reads_count,
//             n_tup_upd + n_tup_ins + n_tup_del AS table_writes_count,
//             pg_size_pretty(pg_relation_size(idstat.relid)) AS table_size
//         FROM
//             pg_stat_user_indexes AS idstat
//         JOIN
//             pg_indexes
//             ON
//             indexrelname = indexname
//             AND
//             idstat.schemaname = pg_indexes.schemaname
//         JOIN
//             pg_stat_user_tables AS tabstat
//             ON
//             idstat.relid = tabstat.relid
//         WHERE
//             indexdef !~* 'unique'
//         ORDER BY
//             idstat.idx_scan DESC,
//             pg_relation_size(indexrelid) DESC
//     ) q) to '/Users/jitcorn/index.json
