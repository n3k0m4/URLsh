const express = require("express");
const helmet = require("helmet");
const monk = require("monk");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("./public"));
/** 
app.get("/", (req, res) => {
  //res.json("HOLA! This is a shortener");
});

app.get("/:id", (req, res) => {
   //For going to a URL 
});
**/
app.post("/url", (req, res) => {
  //For creating to a URL
});

const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`Listening at port: ${port}`);
});
