import { ProductRouter } from './products.route';
import { errorHandler } from './middleware/error-handler';
import express from 'express';
import { InventoryRouter } from './inventory.route';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 4444;

const app = express();
app.use(express.json());
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
  });
});

app.get('/', (_req, res) => {
  res.send('Inventory Server');
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

app.use('/products', ProductRouter);
app.use('/inventory', InventoryRouter);
app.use(errorHandler);
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
