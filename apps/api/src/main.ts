const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;
import { createApp } from './app';
import { OrdersRouter } from './orders.route';
const app = createApp();

app.use('/orders', OrdersRouter);
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
