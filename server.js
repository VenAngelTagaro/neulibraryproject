require("dotenv").config();
const express = require("express");
const app = express();

require("./src/config/db");
require("./src/config/cleanup");

const pageRouters = require("./src/routers/router");

app.use(express.json());
app.use(express.static("public"));
app.use(pageRouters);



app.listen(3000, () => {
    console.log("Listening on port 3000");
});

