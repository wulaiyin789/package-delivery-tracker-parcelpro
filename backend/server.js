const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// DB Connection
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Register all routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tracking', require('./routes/trackingRoutes'));
app.use('/api/shipments', require('./routes/shipmentRoutes'));

// Export the app object for testing
if (require.main === module) {
  connectDB();
  // If the file is run directly, start the server
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
