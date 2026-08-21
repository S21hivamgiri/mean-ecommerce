const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;
import { createApp } from './app';
import { ordersRouter } from '@myCommerce/api-orders';
const app = createApp();

app.use('/orders', ordersRouter);
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
