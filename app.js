if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}

const express=require('express'); //importing express
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');  //provides with layout function to facilitate boilerplating
const methodOverride=require('method-override') //to fake put and delete request
const ExpressError=require('./Utils/ExpressError'); //to handle errors
const session=require('express-session');
const productRoutes=require('./routes/products');
const reviewRoutes=require('./routes/reviews');
const userRoutes=require('./routes/users');
const cartRoutes=require('./routes/carts');
const flash=require('connect-flash')
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
const dbUrl=process.env.DB_URL
const MongoStore=require('connect-mongo');
// const Joi=require('joi'); to validate the schema and set rules

mongoose.connect(process.env.DB_URL,{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true,
    // useFindAndModify:false
});

const db=mongoose.connection;

db.on("error",console.error.bind(console,"connection error:"));

// allows you to callback funtion once connection "open"
db.once("open",()=>{
    console.log("Database Connected");
});


const app=express();    //making instance of express named app
app.engine('ejs',ejsMate);

//__dirname has the path of current directory and hence second paramenter gives the absolute path of views directory
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//convert object sent via res.send to browser in veiwable form
app.use(express.urlencoded({extended:true}));

//will be used in forms at end of action to fake put/deleterequest
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize())
// http://localhost:3000/?$gt="" 

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on('error',function(e){
    console.log('SESSION STORE ERROR',e)
})

const sessionConfig={
    store:store,
    name:'Notdefault',
    secret:'thisisasecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires: Date.now+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(helmet({contentSecurityPolicy:false}));
//passport.session should be after session has been configured
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

//how to store and remove user from the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    // console.log(req.query)
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.info=req.flash('info');
    res.locals.currentUser=req.user;
    next()
})

app.use('/Products',productRoutes)
app.use('/Products/:id/reviews',reviewRoutes)
app.use('/',userRoutes)
app.use('/Cart',cartRoutes)

// '/' is route req is request and res is response
// res.send sends response to browser
app.get('/',(req,res)=>{
    res.render('home');
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message='Something went Wrong'
    res.status(statusCode).render('error',{err});
})

// async function if await is used and await is used when some operation may take some time
// app.get('/makeDriver',async (req,res)=>{
//     const driver=new Driver({name:'Lewis Hamilton',team:'ferarri'})
//     await driver.save()
//     res.send(driver)
// })

//listening at port 3000
app.listen(3000,()=>{                   
    console.log('server is running on port 3000');
})