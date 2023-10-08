const express = require('express')
const app = express() 
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

const url = 'mongodb+srv://yeabsera:yeabsera@yabacl.1g1qs4c.mongodb.net/location-demo?retryWrites=true&w=majority';

async function connectDB(){
    await mongoose.connect(url)
        .then(result => console.log('connected to mongodb...'))
        .catch(err => console.log(err.message))
}

connectDB()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Create A Schema & Model For the User Document
const userSchema = new mongoose.Schema({
    name: String,
    lat: Number,
    lng: Number,
    image: String
})

const User = mongoose.model('User', userSchema )

app.use(express.static('public'));

//get dummy backend response
app.get('/api/data', (req, res) => {
    const data = { message: 'Hello from the backend!' };
    res.send(data) // res.json()
})

//get registered users
app.get('/api/location', async (req, res) => {
    try {
        const result = await User.find()
        res.send(result);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

//creating a user with pre defined lat and lng
app.post('/api/location', async (req, res) => {  
    const user = new User({
        name: req.body.name,
        lat: req.body.lat,
        lng: req.body.lng,
        image: req.body.image 
    })
    const result = await user.save()
    console.log(result)

})

//updating a user with id
app.put('/api/location/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        lat: req.body.lat,
        lng: req.body.lng,
        image: req.body.image
    }, {new: true})

    if(!user) return res.status(400).send("The genre with the given ID was not found")
    res.send(user)
    console.log(user)
})

app.delete('/api/location/:id', async (req ,res) => {
    const user = await User.findByIdAndRemove(req.params.id)
    res.send(user)
})

app.listen(3000, () => console.log('app running on port: 3000'))
