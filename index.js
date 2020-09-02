const express = require("express");
const helmet = require("helmet");
const monk = require("monk");
const morgan = require("morgan");
const cors = require("cors");
const yup = require('yup')
import {nanoid} from 'nanoid';
require("dotenv").config();

const app = express();
app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("./public"));

const schema = yup.object().shape({
  alias : yup.string().trim().matches(/[\w\-_]/i),
  url : yup.string().trim().url().required()
})
/** 
app.get("/", (req, res) => {
  //res.json("HOLA! This is a shortener");
});

app.get("/:id", (req, res) => {
   //For going to a URL 
});
**/
app.post("/url", async (req, res, next) => {
  //For creating to a URL
  const {alias, url} = req.body;
  try {
    await schema.validate({alias, url});
    if (!alias){
      alias = nanoid(7);
    }
    alias = alias.toLowerCase();
    res.json({
      'alias': alias,
      'url': url
    })
  } catch (error) {
    next(error);
  }
});
app.use((error, req, res , next)=> {
  if (error.status){
    res.status(error.status)
  }
  else {
    res.status(500);
  }
  res.json({
    message : error.message,
    stack: process.env.NODE_ENV === 'production' ? 'naah' : error.stack;
  })
})

const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`Listening at port: ${port}`);
});
