const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const userRoutes = require('./routes/user');

mongoose.connect(`mongodb+srv://pekaizilla:${process.env.MONGODB_PASSWORD}@monvieuxgrimoire.pdxm7fc.mongodb.net/?retryWrites=true&w=majority&appName=MonVieuxGrimoire`, 
    {   useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('Error connecting to MongoDB'));

app.use(express.json());

// Set Response Header
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Headers', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);

module.exports = app;