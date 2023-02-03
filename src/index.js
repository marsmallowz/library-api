const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const PORT = 2000;
const routes = require("./routes");
const { urlencoded } = require("body-parser");
console.log(PORT);
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cors());

const db = require("./models");
db.sequelize.sync();

app.use("/auth", routes.authRoute);

app.get("/", (_, res) => {
  res.send("api is running");
});

app.listen(PORT, () => {
  console.log("server is running on Port " + PORT);
});
