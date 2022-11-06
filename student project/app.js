const express = require("express")
const app = express()
const ejs = require("ejs")
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const Student = require("./models/student")
const methodOverride= require("method-override")
// bodyParser.json是用来解析json数据格式的。
// bodyParser.urlencoded则是用来解析我们通常的form表单提交的数据
//middleware
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.set("view engine","ejs")
app.set("useFindAndModify",false)
//每次先需要连接mongod，然后mongo
mongoose.connect("mongodb://localhost:27017/studentDB",{
    useNewUrlParser:true, 
    useUnifiedTopology:true})
    .then(()=>{
        console.log("Successfully connected to mongoDB.")
    }).catch(e=>{
        console.log("Connetion failed.")
        console.log(e)
    })

app.get("/students",async(req,res)=>{
    try{
        let data =await Student.find()
        res.send(data)
    }catch{
        res.send({message:"Error with finding data."})
    }
    
})
app.get("/students/insert",(req,res)=>{
    res.render("studentInsert.ejs")
})
app.get("/students/:id",async(req,res)=>{
    let{id} = req.params
    try{
        let data = await Student.findOne({id})
        if (data !== null){
            res.send(data)
        }else{
            res.status(404)
            res.send({message:"Cannot find data."})
        }
        
    } catch(e){
        res.send("Error!!!")
        console.log(e)
    }
    
    //用find: send you an array, use findOne: send you an object
    // console.log(req.params) //students.params is an object,这个object里面有个property，id 是100
    // res.send("Hello")
    
})

app.post("/students",(req,res)=>{
    let{id,name,age,merit,other} =req.body
    let newStudent = new Student({
        id,
        name,
        age,
        scholarship:{merit,other},
    })
    newStudent
    .save()
    .then(()=>{
        res.send({message:"Successfully post a new student."})
    })
    .catch((e)=>{
        res.send(e)
    })
})
 

// app.get("/students/edit/:id", async(req,res)=>{
//     let {id} = req.params
//     try{
//         let data = await Student.findOne({id})
//         if (data !== null){
//             res.render("edit.ejs",{data})
//         }else{
//             res.send("Cannot find student.")
//         }
        
//     } catch{
//         res.send("Error!!")
//     }
    
// })
app.put("/students/:id",async(req,res)=>{
    let {id, name, age, merit, other} = req.body
    try{
        let d = await Student.findOneAndUpdate(
        {id},
        {id,name,age,scholarship:{merit,other}},
        {
         new:true,
         runValidators:true,
         overwrite:true,
        }
        )
        res.send("Successfully updated the data.")
        // res.redirect(`/students/${id}`)
    } catch{
        res.status(404)
        res.send("Error with updating.")
    }
   // res.send("Thanks for sending put request.")
})

class newData{
    constructor(){}
    setProperty(key,value){
        if (key!=="merit" && key!=="other"){
            this[key] = value
        }else{
            this[`scholarship.${key}`]=value //error handling，自动补全了scholarship.merit
        }
    }
}

app.patch("/students/:id",async(req,res)=>{
    let {id} = req.params
    let newObject = new newData()
    for(let property in req.body){
        newObject.setProperty(property,req.body[property])
    }
    console.log(newObject)
    try{
        let d = await Student.findOneAndUpdate(
        {id},
        newObject,
        {
         new:true,
         runValidators:true, //cannot add overwrite:true
        })
        console.log(d)
        res.send("Successfully updated the data.")
        // res.redirect(`/students/${id}`)
    } catch{
        res.status(404)
        res.send("Error with updating.")
    }
//     // console.log(req.body)
//     // res.send("Thanks for sending put request.")
})
//当客户乱点的时候，设置一个这样的页面


// delete
app.delete("/students/delete/:id",(req,res)=>{
    let {id} = req.params
    Student.deleteOne({id})
    .then((meg)=>{
        console.log(meg)
        res.send("Deleted successfully.")
    })
    .catch((e)=>{
        console.log(e)
        res.send("Delete failed.")
    })
})

app.delete("/students/delete",(req,res)=>{
    Student.deleteMany({})
    .then((meg)=>{
        console.log(meg)
        res.send("Deleted all data successfully.")
    })
    .catch((e)=>{
        console.log(e)
        res.send("Delete failed.")
    })
})

app.get("/*",(req,res)=>{
    res.status(404)
    res.send("Not allowed.")
})
app.listen(3000,()=>{
    console.log("Server is running on 3000.")
})