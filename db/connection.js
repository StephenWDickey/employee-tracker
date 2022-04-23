// we must import mysql2 module to connect to MySQL database
const mysql = require('mysql2');

////////////////////////////////////////////////////


// we use mysql2 to connect to MySQL database
// we set equal to a variable named db
const db = mysql.createConnection (

    // we have an object here with the following properties
    {
        host: 'localhost',
        // MySQL username
        user: 'root',
        // MySQL password
        password: 'mysql_password',
        // select the database we're using
        database: 'challenge12'

    },

    console.log('Connected to the employee database.')
    
);

module.exports = db;