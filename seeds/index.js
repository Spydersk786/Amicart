const mongoose=require('mongoose')
const Product=require('../models/product')
const axios = require('axios');

mongoose.connect('mongodb+srv://shivam:shivam28@project1.kja17z2.mongodb.net/Products',{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true
});

const db=mongoose.connection;

db.on("error",console.error.bind(console,"connection error:"));

// allows you to callback funtion once connection "open"
db.once("open",()=>{
    console.log("Database Connected");
});

const seedDB=async()=>{
    await Product.deleteMany({});
    for(let i=0;i<19;i++)
    {
        const response = await axios.get('https://fakestoreapi.com/products');
        const data = response.data;
        const p = new Product({
            title: data[i].title,
            price: Math.ceil(data[i].price),
            category:data[i].category,
            description:data[i].description,
            images:[ {
                url: 'https://res.cloudinary.com/dphrbeodk/image/upload/v1720455248/Amicart/gn9yj4fhgf0jeaqmetsg.jpg',
                filename: 'Amicart/gn9yj4fhgf0jeaqmetsg',
              }
            ],
            owner:'668f8c9eeacc23cf516f165c'});
        await p.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})


