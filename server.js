const express=require("express");
const app=express();
const path=require("path");
const port=8000;
require("dotenv").config();
const config={
    CLIENT_ID:process.env.CLIENT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET
}
app.use(express.static(path.join(__dirname,'public')));
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
})
app.get('/secret',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','secret.html'));
})
app.listen(8000,()=>{
    console.log('connected to port succcessfully!');
})