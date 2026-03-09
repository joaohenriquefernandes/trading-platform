import cors from "cors";
import express, { Request, Response } from "express";
import { AccountDAODatabase } from "./AccountDAO";
import { AccountService } from "./AccountService";

const app = express();
app.use(express.json());
app.use(cors());

const accountDAO = new AccountDAODatabase();
const accountService = new AccountService(accountDAO);

app.post("/signup", async (request: Request, response: Response) => {
  const account = request.body;
  try {
    const output = await accountService.signup(account);
    response.json(output);
  } catch (error: any) {
    response.status(422).json({
      message: error.message,
    });
  }
});

app.get(
  "/accounts/:accountId",
  async (request: Request, response: Response) => {
    const { accountId } = request.params;
    const output = await accountService.getAccount(accountId);
    response.json(output);
  },
);

app.listen(3000);
