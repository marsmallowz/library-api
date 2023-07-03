const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT;
const routes = require("./routes");
const { urlencoded } = require("body-parser");
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cors());

// const db = require("./models");
// db.sequelize.sync({ alter: true });

app.use("/auth", routes.authRoute);
app.use("/carts", routes.cartRoute);
app.use("/books", routes.bookRoute);
app.use("/loans", routes.loanRoute);
app.use("/categories", routes.categoryRoute);
app.use("/post_image", express.static(`${__dirname}/public/book`));

app.listen(PORT, () => {
  console.log("server is running on Port " + PORT);
});
