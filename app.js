const express = require('express');
const mongoose = require('mongoose');

const app = express();

const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://pekaizilla:0YX5dWz7hOZUE0id@monvieuxgrimoire.pdxm7fc.mongodb.net/?retryWrites=true&w=majority&appName=MonVieuxGrimoire', 
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