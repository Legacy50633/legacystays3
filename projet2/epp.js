const express = require('express')

const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')

const mongoose = require('mongoose');

const Fruit = require('./models/fruits');
const methodOverride = require("method-override")
mongoose.connect('mongodb://0.0.0.0:27017/ninja-fruit',{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    
})

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error   "));
db.once("open",()=>{
    console.log("Hooked bro")
})

const app = express();

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(methodOverride('_method'))

const sessionConfig = {

       
    secret:"hope",
     resave:false,
     saveUninitialized:true,
     cookie:
     {
         httpOnly:true,
         expires:Date.now() +1000*60*60*24*7,
         maxAge:1000*60*60*24*7
     }
} 
app.use(session(sessionConfig))
app.use(flash())

app.use((req,res,next)=>{
    res.locals.success =  req.flash('success');
    res.locals.error =  req.flash('error')
    next();
 })
app.get('/ninjas/home',(req,res)=>{
  
    res.render('fruits/home')
})

app.get('/ninjas/fruits',async(req,res)=>{
    const fruits = await Fruit.find({})
    
        res.render('fruits/fruit',{fruits})
    })
app.get('/ninjas/fruits/new',async(req,res)=>{
  
    res.render('fruits/new')
})
app.post('/ninjas/fruits',async(req,res)=>{
    const fruit =  new Fruit(req.body.fruit)
    await fruit.save();
    req.flash('success',"Successfully created!")
    res.redirect(`/ninjas/fruits/${fruit._id}`)
})

app.get('/ninjas/fruits/:id',async(req,res)=>{


        const fruit = await Fruit.findById(req.params.id)
        res.render('fruits/show',{fruit})
   
    
})
app.get('/ninjas/fruits/:id/edit',async(req,res)=>{
    const fruit = await Fruit.findById(req.params.id)
    res.render('fruits/edit',{fruit})
})

app.put('/ninjas/fruits/:id',async(req,res)=>{
    const {id } = req.params
    const fruit = await Fruit.findByIdAndUpdate(id,{...req.body.fruit})
    req.flash('success',"Successfully Edited")    
    res.redirect(`/ninjas/fruits/${fruit._id}`)
})

app.delete('/ninjas/fruits/:id',async(req,res)=>{
    const {id} = req.params
    await Fruit.findByIdAndDelete(id)
    req.flash('success',"Successfully Deleted")  
    res.redirect('/ninjas/fruits')
})

app.listen(3000,(req,res)=>{
    console.log("Off course i got you")
})
