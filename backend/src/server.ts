import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import aiRoutes from './routes/aiRoutes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));