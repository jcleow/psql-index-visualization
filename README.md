# psql-index-visualization
Visualize some postgres stats on a lms dev db

Originally seen on: https://www.postgresql.org/message-id/CANu8FixpRb65_7TPKpZ=5r7ndZrKctZZaYwjO0XKpqaXy9JYjw@mail.gmail.com

SQL query used:
```
 \copy (SELECT row_to_json(q) FROM
    (
        SELECT
            idstat.relname AS TABLE_NAME,
            indexrelname AS index_name,
            idstat.idx_scan AS index_scans_count,
            idstat.idx_tup_read as index_scan_tuple_read,
            idstat.idx_tup_fetch as index_scan_tuple_fetch,
            pg_relation_size(indexrelid) AS index_size,
            tabstat.idx_scan AS table_reads_index_count,
            tabstat.seq_scan AS table_reads_seq_count,
            tabstat.seq_scan + tabstat.idx_scan AS table_reads_count,
            n_tup_upd + n_tup_ins + n_tup_del AS table_writes_count,
            pg_relation_size(idstat.relid) AS table_size
        FROM
            pg_stat_user_indexes AS idstat
        JOIN
            pg_indexes
            ON
            indexrelname = indexname
            AND
            idstat.schemaname = pg_indexes.schemaname
        JOIN
            pg_stat_user_tables AS tabstat
            ON
            idstat.relid = tabstat.relid
        WHERE
            indexdef !~* 'unique'
        ORDER BY
            idstat.idx_scan DESC,
            pg_relation_size(indexrelid) DESC
    ) q) to '/Users/jitcorn/index.json'
```

Quick primer on what the important fields are:

`id_stat.idx_scan`
* Metric that provides information about the number of index scans performed on a table in a PostgreSQL database.

`id_stat.idx_tup_read`
* idx_tup_read is number of index entries returned by scans on this index


`id_stat.idx_tup_fetch`
* idx_tup_fetch is number of live table rows fetched by simple index scans using this index


What is the difference between `idx_tup_read` and `idx_tup_fetch`?
* The reads are when index gives back position of the row required and fetches are when the index gives back the table rows themselves.

https://dba.stackexchange.com/a/187006

Some resources:
[https://sgerogia.github.io/Postgres-Index-And-Queries/](https://sgerogia.github.io/Postgres-Index-And-Queries/)

[https://www.postgresql.org/docs/9.2/monitoring-stats.html](https://www.postgresql.org/docs/9.2/monitoring-stats.html)