import './instrumentation';
import { OrdersRouter } from './orders.route';
import { errorHandler } from './middleware/error-handler';
import { metricsMiddleware } from './middleware/metrics.middleware';
import express from 'express';
import { createLogger } from '@myCommerce/logger';
import pinoHttp from 'pino-http';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;
import { requestContext } from './middleware/request-context';
const logger = createLogger('order-api');

const app = express();
app.use(
  pinoHttp({
    logger,
    genReqId: (req) =>
      req.headers['x-request-id']?.toString() || crypto.randomUUID(),
  }),
);
app.use(express.json());
app.use(requestContext);
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
  });
});

app.get('/', (_req, res) => {
  res.send('Order Server');
});

app.use(metricsMiddleware);

app.get('/test-error', (_req, res) => {
  res.status(500).json({
    error: 'Testing alert',
  });
});

app.get('/test-log', (req, res) => {
  logger.info(
    {
      event: 'test_log',
      requestId: req.requestId,
      message: 'Testing telemetry log correlation',
    },
    'Test log generated',
  );

  res.status(200).json({
    ok: true,
    message: 'Test log generated',
    requestId: req.requestId,
  });
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

app.use('/orders', OrdersRouter);
app.use(errorHandler);
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
