const { nanoid } = require("nanoid");
const express = require("express");
const helmet = require("helmet");
const monk = require("monk");
const morgan = require("morgan");
const cors = require("cors");
const yup = require("yup");
require("dotenv").config();

const db = monk(process.env.DB_CONNECT);
const urls = db.get("Urls");
urls.createIndex({ alias: 1 }, { unique: true });
const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("./public"));

const schema = yup.object().shape({
  alias: yup
    .string()
    .trim()
    .matches(/[\w\-_]/i),
  url: yup.string().trim().url().required(),
});
/** 
app.get("/", (req, res) => {
  //res.json("HOLA! This is a shortener");
});
**/
app.get("/:id", async (req, res, next) => {
  //For going to a URL
  const { id: alias } = req.params;
  try {
    const url = await urls.findOne({ alias });
    if (url) {
      res.redirect(url.url);
    }
    res.redirect("/?error=Not found");
  } catch (error) {
    next(error);
  }
});

app.post("/url", async (req, res, next) => {
  //For creating to a URL
  let { alias, url } = req.body;
  try {
    await schema.validate({
      alias,
      url,
    });
    if (!alias) {
      alias = nanoid(7);
    } else {
      const existing = await urls.findOne({ alias });
      if (existing) {
        throw new Error("Alias already used");
      }
    }
    alias = alias.toLowerCase();
    const newUrl = {
      alias,
      url,
    };
    const created = await urls.insert(newUrl);
    res.json(created);
  } catch (error) {
    next(error);
  }
});
app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  /*
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "naah" : error.stack,
  });
  */
});

const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`Listening at port: ${port}`);
});
