require('dotenv').config();
let express = require('express');
let request = require('request');
let querystring = require('querystring');
let cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 1234;

/*

//Authorization code flow 
//Auskommentiert, da implicit flow genutzt wird

//constants

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.REDIRECT_URI;
const stateKey = 'auth_state';

//helper functions
let randomString = function (length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

//express middleware setup
app.use(cookieParser());


app.get('/login', (req, res) => {
    let state = randomString(16);
    let scope = 'user-read-private user-read-email playlist-read-private user-top-read user-read-recently-played';

    res.cookie(stateKey, state);
    res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectURI,
        state: state
    })}`);
});

app.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect(`http://localhost:4200/#${querystring.stringify({ error: 'state_error' })}`);
    } else {
        res.clearCookie(stateKey);

        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirectURI,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let accessToken = body.access_token,
                    refreshToken = body.refresh_token;

                    console.log(body);

                //redirect to frontend
                res.redirect(`http://localhost:4200/login?${querystring.stringify({
                    access_token: accessToken,
                    refresh_token: refreshToken
                })}`);
            } else {
                res.redirect('http://localhost:4200/error');
            }
        });
    }
});

*/




app.get('/', (req, res) => {
    res.write('Hello World');
    res.end();
})

app.listen(PORT, () => {
    console.log(`listening on Port ${PORT}`);
});