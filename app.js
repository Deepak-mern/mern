const dotenv = require("dotenv")
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
// app.use(cookieParser())

dotenv.config({path:'./config.env'});
require('./db/conn');
app.use(express.json())
// const User = require('./model/userschema');
// we link the router files to make
app.use(require('./router/auth'));


const DB = process.env.DATABASE;
const PORT = process.env.PORT;





// app.get("/contact", (req, res) => {
//   res.cookie("test5", 'deepal')
//    res.send(`hello world form  contact server`);
//  });
app.get("/", (req, res) => {
   res.send(`hello world form server`);
 });
// app.get("/about",middleware,(req, res) => {
//     console.log(`hello about`)
//  res.send(`hello world form about`);
// });

app.listen(PORT, () => {
console.log(`server is running at ${PORT}`);
});
