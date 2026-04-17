import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
const app = express();
const port = Number(process.env['PORT']);

app.use(
  '/',
  cors(),
  express.json(),
  express.urlencoded({ extended: true }),
  helmet(),
);

app.get('/', (_req: express.Request, res: express.Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
