const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;
import { createApp } from './app';

const app = createApp();
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
