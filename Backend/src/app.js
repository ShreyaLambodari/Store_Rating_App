const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json()); 


// Routes 
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/store-owner', require('./routes/storeOwnerRoutes'));

module.exports = app;