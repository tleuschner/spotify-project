require('dotenv').config();
let express = require('express');

//constants
const app = express();
const PORT = process.env.PORT | 1234;


app.listen(PORT, () => {
    console.log(`listening on Port ${PORT}`);
});