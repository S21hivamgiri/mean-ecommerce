const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;
import { createApp } from './app';
import { OrdersRouter } from './orders.route';
import {errorHandler} from "./middleware/error-handler"
const app = createApp();

app.use('/orders', OrdersRouter);
app.use(errorHandler);
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
