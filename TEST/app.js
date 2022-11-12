require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash")

//middleware
app.set("view engine","ejs")
app.use(cookieParser(process.env.SECRET))
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
}))

app.use(flash())

mongoose    
    .connect("mongodb://localhost:27017/test",{
        useFindAndModify:false,
        useNewUrlParser:true,
        useUnifiedTopology:true,

    })
    .then(()=>{
        console.log("Connected to mongodb.")
    })
    .catch((e)=>{
        console.log(e)
    })

app.get("/",(req,res)=>{
   req.flash("success_msg","Successfully get to the homepage.")

   res.send("Hi, " + req.flash("success_msg"))
})    

app.get("/verifyuser",(req,res)=>{
    req.session.isVerified = true
    res.send("You are verified")
})

app.get("/secret",(req,res)=>{
    if (req.session.isVerified == true){
        res.send("Here is my sēcret - I love panda.")
    }else{
        res.status(403).send("You are not authorized to see my secret.") //403禁止查看网页内容
    }
})

const monkeySchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:5,
    }

})
// create a model, is like a table in SQL
const Monkey = mongoose.model("Monkey",monkeySchema)

app.get("/", async(req,res,next)=>{
    try{ 
       await Monkey.findOneAndUpdate(
        {name:"Benson K."}, 
        {name:"Benson Kelly"},
        {new:true, runValidators:true},
        (err,doc)=>{
            if (err){
                res.send(err)
            }else{
                console.log(doc)
                res.send(doc)
                console.log("should print.")
            }
            }
        ) //there is an error in findOneAndUpdate  
    } catch(e){
        console.log(e)
        next(e)
    }
  
})

//防止别人乱打一通
app.get("/*",(req,res)=>{
    res.status(404).send("404 Page not found.")
})
// error handler, 放在这里的原因是：在app.get中有任何的error就会放到app.use中的err中。 
app.use((err,req,res,next)=>{
    console.log(err)
    res.status(500).send("Something is broken, we will fix it soon.")
})


app.listen(3000,()=>{
    console.log("Server running on port 3000.")
})