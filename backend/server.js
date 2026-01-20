const dotenv = require('dotenv');
const path = require('path');
const app = require('./app');
const connectDatabase = require('./config/database');

// ✅ Load environment variables only once
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Connect to MongoDB
connectDatabase();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ My Server running in ${NODE_ENV} mode on port ${PORT}`);
});
