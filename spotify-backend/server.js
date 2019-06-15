require('dotenv').config();
let express = require('express');
let bodyParser = require('body-parser');
let mysql = require('mysql');
let cors = require('cors');

const app = express();
const jsonParser = bodyParser.json();
const PORT = process.env.PORT || 1234;
/**
 * Setup connection credentials
 */
let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

/**
 * Connect to database
 */
connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
});

app.use(jsonParser).use(cors());

/**
 * Get current Visitors from Database and send response as JSON
 * on error send 500 response
 */
app.get('/visitors', (req, res) => {
    let uniqueUsers;
    connection.query('SELECT COUNT(*) AS visitors FROM users ', (err, result) => {
        if (err) {
            res.status(500).json({
                "visitors": 000
            });
        } else {
            uniqueUsers = result[0].visitors;
            res.status(200).json({
                "visitors": uniqueUsers
            });
        }
    });
});


/**
 * insert users into MySQL Databse. Use INSERT IGNORE to only insert if user hasnt already been added to DB
 * 
 *
 */
app.post('/user', (req, res) => {
    if (req.body && req.body.spotifyID && req.body.country) {
        let country = req.body.country;
        let spotifyID = req.body.spotifyID;
        connection.query('INSERT IGNORE INTO users (SPOTIFY_ID, COUNTRY) VALUES (?, ?)', [spotifyID, country], (err) => {
            if (err) {
                res.status(500).json(null);
                throw err;
            } 
        });
        res.status(200).json(null);

    } else {
        res.status(500).json(null);
    }
});

/**
 * Start server on specified port
 */
app.listen(PORT, () => {
    console.log(`listening on Port ${PORT}`);
});