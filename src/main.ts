import express, { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import pgp from 'pg-promise';

const app = express();
app.use(express.json());

const connection = pgp()('postgres://postgres:123456@db:5432/app');

app.post('/signup', async (request: Request, response: Response) => {
  const accountId = randomUUID();
  const account = request.body;
  await connection.query('insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)', [accountId, account.name, account.email, account.document, account.password]);
  response.json({
    accountId
  });
});
app.get('/accounts/:accountId', async (request: Request, response: Response) => {
  const accountId = request.params.accountId;
  const [account] = await connection.query('select * from ccca.account', []);
  response.json(account);
});
app.listen(3000);
