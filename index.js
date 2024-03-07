import express from "express";
import db from "./db.mjs";
import router from "./route.mjs";
const app=express();
app.set('view engine','ejs');

const port=3001;
db.connect((err)=>{
    if(err)throw err;
    app.use('/',router);
    app.listen(port,(req,res)=>{
        console.log(`server is listening on ${port}`)
    })
})
