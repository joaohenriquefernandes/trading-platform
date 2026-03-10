import cors from "cors";
import express, { Request, Response } from "express";
import { AccountAssetDAODatabase } from "./AccountAssetDAO";
import { AccountDAODatabase } from "./AccountDAO";
import { AccountService } from "./AccountService";
import { Registry } from "./Registry";

const app = express();
app.use(express.json());
app.use(cors());

Registry.getInstance().provide("accountDAO", new AccountDAODatabase());
Registry.getInstance().provide(
  "accountAssetDAO",
  new AccountAssetDAODatabase(),
);
const accountService = new AccountService();

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

type AccountParams = {
  accountId: string;
};

app.get(
  "/accounts/:accountId",
  async (request: Request<AccountParams>, response: Response) => {
    const { accountId } = request.params;
    const output = await accountService.getAccount(accountId);
    response.json(output);
  },
);

app.listen(3000);
