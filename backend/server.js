const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3100;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://balotan61:lPUbBGFITDisXFRl@td-db.e9xh2sx.mongodb.net/logindb',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error: ', err));

const userSchema = new mongoose.Schema
({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    phone: { type: Number, required: false }
});

const User = mongoose.model('User', userSchema);

//test route
app.get('/', (req, res) =>
{
    res.json({ status: 'OK' });
});


app.get('/users', async (req, res) =>
{
    try
    {
        const users = await User.find();
        res.json(users);
    }catch (err)
    {
        res.status(500).json({ message: err.message });
    }
});

const server = app.listen(port, () => 
{
    console.log(`Server running @ http:localhost:${port}`);
});