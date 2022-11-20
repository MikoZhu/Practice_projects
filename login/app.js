require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash")
const bodyParser = require("body-parser")
const User = require("./models/user")
const bcrypt = require("bcrypt")
const saltRounds = 10

//middleware
app.set("view engine","ejs")


app.use(cookieParser(process.env.SECRET))
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
}))

app.use(flash())
app.use(bodyParser.urlencoded({extended:true}))

// set require of login
const requireLogin = (req,res,next)=>{
    if (!req.session.isVerfied ==true){
        res.redirect("login")
    }else{
        next()
    }
}
mongoose    
    .connect("mongodb://localhost:27017/test",{
        useFindAndModify:false,   
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }
    )
    .then(()=>{
        console.log("Connected to mongodb.")
    })
    .catch((e)=>{
        console.log(e)
    })

app.get("/",(req,res)=>{
   res.send("Home page")
})    

app.get("/signup",(req,res)=>{
    res.render("signup")
})

app.get("/secret",requireLogin,(req,res)=>{
        res.render("secret")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",async(req,res)=>{
    let {username,password}=req.body
    try {
        let foundUser = await User.findOne({username})
        //if username cannot be found in db or type the wrong email address,
        //it will exist error
        if (foundUser) {
            bcrypt.compare(password,foundUser.password,(err,result)=>{
                if (err){
                    next (err)
                }
                if (result ===true){
                    req.session.isVerfied = true
                    res.redirect("secret")
                } else{
                    res.send("Username or password is not correct.")
                }
            })
        }else {
            res.send("Username or password is not correct.")
        }
      
        // console.log(foundUser)
        // if (foundUser && password == foundUser.password ){
        //     res.render("secret")
        // }else{
        //     res.send ("Username or password not correct")
        // }
    } catch (e){
        next(e)
    }   
})

app.post("/signup", async(req,res,next)=>{
    let {username,password} = req.body
    try{
       //if user save the same username
        let foundUser = await User.findOne({username})
        if (foundUser){
            res.send("Username has been taken. Please change a new email.")
        } else{
            //use hash function 
    bcrypt.genSalt(saltRounds,(err,salt) =>{
        if (err){
            next(err)
        }
        // console.log("Salt is " + salt)
        bcrypt.hash(password,salt,(err,hash)=>{
            if (err){
                next(err)
            }
            // console.log("Hash is " + hash)
            let newUser = new User({username,password:hash})
            try{
                newUser
                .save()
                .then(()=>{
                    res.send("Data has been saved.")
                })
                .catch((e)=>{
                    res.send("Error")
            })
        } catch(err){
            next(err)
        }
        })
    })
        }
    } catch (err){
        next (err)
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