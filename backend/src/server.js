import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB();
    const server=app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    server.on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
})();