\echo 'Delete and recreate capstone2_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE capstone2_test;
CREATE DATABASE capstone2_test;
\connect capstone2_test

\i db_schema.sql
\i db_seed.sql