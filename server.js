const express=require("express");
const app=express();
const path=require("path");
const https=require("https");
const passport=require("passport");
const fs=require("fs");
const {Strategy}=require("passport-google-oauth20");
const port=8000;
require("dotenv").config();
const config={
    CLIENT_ID:process.env.CLIENT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET
}
const AUTH_OPTIONS={
    callbackURL:'/auth/google/callback',
    clientID:config.CLIENT_ID,
    clientSecret:config.CLIENT_SECRET,
}
function verifyCallback(accessToken,refreshToken,profile,done){
    console.log('google profile ',profile);
    done(null,profile);
}
passport.use(new Strategy(AUTH_OPTIONS,verifyCallback))
app.use(passport.initialize());
app.use(express.static(path.join(__dirname,'public')))
app.get('/auth/google',passport.authenticate('google',{
    scope:['email'],
}))
app.get('/auth/google/callback', passport.authenticate('google',{
    failureRedirect:'/failure',
    successRedirect:'/',
    session:false,
}),(req,res)=>{
    console.log('callback called by google');
});
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
})
app.get('/secret',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','secret.html'));
})
app.get('/failure',(req,res)=>{
    return res.send('failed to authenticate');
})
const server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
}, app).listen(port, () => {
    console.log(`App backend listening on port : ${port}!`);
})
