import { errorHandler } from './middleware/error-handler';
import { prisma } from './infrastructure/db/prisma';
import { OutboxRepository } from './outbox.repository';
import { OutboxWorker } from './outbox.worker.js';
import express from 'express';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 6666;
const app = express();
app.use(express.json());

const repository = new OutboxRepository(prisma);

const worker = new OutboxWorker(repository);

console.log('Outbox worker started');

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
  });
});

app.get('/', (_req, res) => {
  res.send('Outbox Server');
});

// CORS configuration for React app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

setInterval(async () => {
  try {
    await worker.process();
  } catch (error) {
    console.error('Outbox worker crashed', error);
  }
}, 1000);


app.use(errorHandler);
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
