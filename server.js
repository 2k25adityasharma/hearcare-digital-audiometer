require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const patientRoutes = require('./routes/patientRoutes');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const testSessionRoutes = require('./routes/testSessionRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/health_db')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Fresh backend is running live!');
});

app.use('/api/patients', patientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/test-sessions', testSessionRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});