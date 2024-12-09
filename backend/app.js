require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const locationRoutes = require('./routes/locationRoutes');

const app = express();
connectDB();

app.use(express.json());
app.use('/api/locations', locationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
