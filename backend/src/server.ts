// server.ts
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { requireAuth } from '@clerk/clerk-sdk-node'; // Correct import

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/protected', requireAuth(), (req, res) => { // Correct middleware usage
  const userId = req.auth.userId;
  res.json({ message: `Hello, user ${userId}` });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
