const express=require("express");
const app=express();
const path=require("path");
const https=require("https");
const passport=require("passport");
const fs=require("fs");
const {Strategy}=require("passport-google-oauth20");
const cookieSession=require("cookie-session");
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
app.use(cookieSession({
    name:'session',
    maxAge:24*60*60*1000,
    keys:['this is a cookie']
}))
passport.use(new Strategy(AUTH_OPTIONS,verifyCallback))
passport.serializeUser((user,done)=>{
   
    done(null,user);
});
passport.deserializeUser((obj,done)=>{
    done(null,obj);
});
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname,'public')))
function checkedLoggedIn(req,res,next){
    const isLoggedIn=(req.isAuthenticated()&&req.user);
    if(!isLoggedIn)
    {
        return res.status(401).json({
            error:'login first',
        });
    }
    next();
}
app.get('/auth/google',passport.authenticate('google',{
    scope:['email'],
}))
app.get('/auth/google/callback', passport.authenticate('google',{
    failureRedirect:'/failure',
    successRedirect:'/',
    session:true,
}),(req,res)=>{
    console.log('callback called by google');
});
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
})
app.get('/secret',checkedLoggedIn,(req,res)=>{
    res.sendFile(path.join(__dirname,'public','secret.html'));
})
app.get('/failure',(req,res)=>{
    return res.send('failed to authenticate');
})
app.get('/auth/logout',(req,res)=>{
    req.logOut();
    return res.redirect('/');
})
const server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
}, app).listen(port, () => {
    console.log(`App backend listening on port : ${port}!`);
})
