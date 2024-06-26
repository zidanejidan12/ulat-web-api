import express from 'express';
import dotenv from 'dotenv';
import connectDB from './infrastructure/databases/mongoDb';
import osuUserRoutes from './interfaces/routes/osuUserRoutes';
import osuTeamRoutes from './interfaces/routes/osuTeamRoutes';
import osuBeatmapRoutes from './interfaces/routes/osuBeatmapRoutes';
import osuMappoolRoutes from './interfaces/routes/osuMappoolRoutes';
import osuScheduleRoutes from './interfaces/routes/osuScheduleRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8086;

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(express.json());

// Routes
app.use('/api', osuUserRoutes);
app.use('/api', osuTeamRoutes);
app.use('/api', osuBeatmapRoutes);
app.use('/api', osuMappoolRoutes);
app.use('/api', osuScheduleRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
