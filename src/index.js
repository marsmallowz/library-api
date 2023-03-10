const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
// var multer = require("multer");
// const upload = multer();
dotenv.config();

const PORT = process.env.PORT;
const routes = require("./routes");
const { urlencoded, json } = require("body-parser");
console.log(PORT);
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
// app.use(json());

app.use(urlencoded({ extended: false }));
app.use(cors());
// app.use(upload.array());

// const db = require("./models");
// db.sequelize.sync({ alter: true });

app.use("/auth", routes.authRoute);
app.use("/carts", routes.cartRoute);
app.use("/books", routes.bookRoute);
app.use("/loans", routes.loanRoute);
app.use("/categories", routes.categoryRoute);
app.use("/post_image", express.static(`${__dirname}/public/book`));

app.get("/", (_, res) => {
  res.send("api is running");
});

app.listen(PORT, () => {
  console.log("server is running on Port " + PORT);
});
