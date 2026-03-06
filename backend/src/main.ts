import express, { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import pgp from 'pg-promise';
import { validateCpf } from './validateCpf';
import { validatePassword } from './validatePassword';
import { validateEmail } from './validateEmail';
import { validateName } from './validateName';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const connection = pgp()('postgres://postgres:123456@db:5432/app');

app.post('/signup', async (request: Request, response: Response) => {
  const accountId = randomUUID();
  const account = request.body;
  if (!validateName(account.name)) {
    response.status(422).json({
      message: 'Invalid name'
    });
    return;
  }
  if (!validateEmail(account.email)) {
    response.status(422).json({
      message: 'Invalid email'
    });
    return;
  }
  if (!validateCpf(account.document)) {
    response.status(422).json({
      message: 'Invalid document'
    });
    return;
  }
  if (!validatePassword(account.password)) {
    response.status(422).json({
      message: 'Invalid password'
    });
    return;
  }
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
