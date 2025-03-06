const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const cors = require('cors');

const app = express();
const port = 3000;

connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => console.log(`🚀 Serveur en écoute sur http://localhost:${port}`));
