import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // Import the path module
import { fileURLToPath } from 'url'; // Import fileURLToPath

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// New route to serve projects.json
app.get('/projects.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'projects.json'));
});

// Existing routes
app.get('/api', (req, res) => {
  res.send('API running');
});

app.get('/', (req, res) => {
  res.send('Welcome to my backend!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));