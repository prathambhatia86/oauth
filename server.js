const express=require("express");
const app=express();
const path=require("path");
const port=8000;
app.use(express.static(path.join(__dirname,'public')));
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
})
app.listen(8000,()=>{
    console.log('connected to port succcessfully!');
})