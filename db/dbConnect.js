const mysql = require('mysql2');

// const dbConnect = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'fleksa',
// });

const dbConnect = mysql.createConnection(process.env.DATABASE_URL);

module.exports = dbConnect;
