const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Fresh backend is running live!');
});

// Routes
const patientRoutes = require('./routes/patientRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/patients', patientRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;