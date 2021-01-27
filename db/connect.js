const mysql = require("mysql");
const util = require("util");


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'employees'
});

connection.connect()
// connect to the mysql server and sql database
connection.query = util.promisify(connection.query, console.log("You are connected: "));


// connection.connect(function (err) {
//     if (err) throw err;
//     console.log("connected as id " + connection.threadId + "\n");
// });


module.exports = connect;