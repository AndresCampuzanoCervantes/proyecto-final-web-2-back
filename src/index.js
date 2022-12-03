const express = require("express");
const fs = require("fs");
const https = require("https");
const app = express();
const { config } = require("./config/index");
const bodyParser = require("body-parser");
const UserApi = require("./routes/users");
const ParameterApi = require("./routes/parameter");
const FilmsApi = require("./routes/Films");
const FilmsListsApi = require("./routes/filmsLists");
const cors = require('cors');


app.use(cors())
app.use(express.json());
app.set("key", config.secret);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

UserApi(app);
ParameterApi(app);
FilmsApi(app);
FilmsListsApi(app);

app.listen(config.port, function () {
    console.log(`Listening http://localhost:${config.port}`);
});