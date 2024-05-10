const express = require('express');
const mongoose = require('mongoose');
const corsMiddleware = require('./middlewares/cors');

const app = express();

// Set Response Header to allow any Origin
app.use(corsMiddleware);

const userRoutes = require('./routes/auth');

mongoose.connect(`mongodb+srv://pekaizilla:${process.env.MONGODB_PASSWORD}@monvieuxgrimoire.pdxm7fc.mongodb.net/?retryWrites=true&w=majority&appName=MonVieuxGrimoire`, 
    {   useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('Error connecting to MongoDB'));

app.use(express.json());

app.use('/api/auth', userRoutes);

module.exports = app;