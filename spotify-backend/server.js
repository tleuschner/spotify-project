require('dotenv').config();
let express = require('express');
let bodyParser = require('body-parser');
let mysql = require('mysql');
let cors = require('cors');

const app = express();
const jsonParser = bodyParser.json();
const PORT = process.env.PORT || 1234;
let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
});

app.use(jsonParser).use(cors());


app.get('/', (req, res) => {
    res.write('Hello World');
    res.end();
});

app.get('/visitors', (req, res) => {
    let uniqueUsers;
    connection.query('SELECT COUNT(*) AS visitors FROM users ', (err, result) => {
        if (err) {
            res.status(400).json({
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


//TODO: double check status codes
app.post('/user', (req, res) => {
    if (req.body && req.body.spotifyID && req.body.country) {
        let country = req.body.country;
        let spotifyID = req.body.spotifyID;
        connection.query('INSERT IGNORE INTO users (SPOTIFY_ID, COUNTRY) VALUES (?, ?)', [spotifyID, country], (err) => {
            if (err) throw err;
        });
        res.status(200).json(null);

    } else {
        res.status(400).json(null);
    }
});

app.listen(PORT, () => {
    console.log(`listening on Port ${PORT}`);
});