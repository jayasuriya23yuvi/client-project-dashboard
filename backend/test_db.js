const pool = require("./src/config/db");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connection successful in postgresSQL ...");
    console.log(res.rows);
  }
  pool.end();
});