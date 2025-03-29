# GTFS Backend

Server code and scripts to work with [GTFS Dashboard](https://github.com/transit-ink/gtfs-dashboard) and [GTFS UI](https://github.com/transit-ink/gtfs-ui)

## Running the server

Swagger UI is available at

## Importing data from GTFS files to PostgresQL database

```
cd scripts
npm install
node import-gtfs.js ../gtfs/blr
```

#### Options

- `--clean`: Delete all existing data in tables before importing
- `--batch-size`: No. of records to insert at once in the DB query. Defaults to 1000.

## Data

- The GTFS files for BLR are taken from the [bmtc-gtfs](https://github.com/Vonter/bmtc-gtfs) repo by Vonter
