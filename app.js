const express = require('express');
const mongoose = require('mongoose');
const corsMiddleware = require('./middlewares/cors');

const app = express();

// Set Response Header to allow any Origin
app.use(corsMiddleware);

mongoose.connect(`mongodb+srv://pekaizilla:${process.env.MONGODB_PASSWORD}@monvieuxgrimoire.pdxm7fc.mongodb.net/?retryWrites=true&w=majority&appName=MonVieuxGrimoire`, 
    {   useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('Error connecting to MongoDB'));

app.use(express.json());

const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const bookRoutes = require('./routes/book');
app.use('/api/books', bookRoutes);

module.exports = app;