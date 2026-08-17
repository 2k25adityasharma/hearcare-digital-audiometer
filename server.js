require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const patientRoutes = require('./routes/patientRoutes');
 feature/my-work
const testRoutes = require('./routes/testRoutes');

const testSessionRoutes = require('./routes/testSessionRoutes');

main
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/health_db')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/patients', patientRoutes);
 feature/my-work
app.use('/api/tests', testRoutes);


app.use('/api/test-sessions', testSessionRoutes);
 main

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});