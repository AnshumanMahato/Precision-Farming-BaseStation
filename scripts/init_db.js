const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Usage: node init_db.js <database_name>");
  process.exit(1);
}

const dbname = process.argv[2];

const db = new sqlite3.Database(
  path.join(__dirname, `../database/${dbname}.db`)
);

const queryFile = path.join(__dirname, "../database/schema.sql");

fs.readFile(queryFile, "utf8", (err, sqlQueries) => {
  if (err) {
    console.error(`Error reading SQL file: ${err.message}`);
    return;
  }

  // Execute the SQL queries
  db.exec(sqlQueries, (execErr) => {
    if (execErr) {
      console.error(`Error executing SQL queries: ${execErr}`);
    } else {
      console.log("SQL queries executed successfully.");
    }
  });
});
