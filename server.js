require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Patient = require('./models/Patient');
const patientRoutes = require('./routes/patientRoutes');
const testRoutes = require('./routes/testRoutes');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/health_db')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ DB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Fresh backend is running live!');
});
app.use('/api/patients', patientRoutes);
app.use('/api/tests', testRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});