import cors from "cors";
import express, { Request, Response } from "express";
import { getAccount, signup } from "./main";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (request: Request, response: Response) => {
  const account = request.body;
  try {
    const output = await signup(account);
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
    const output = await getAccount(accountId);
    response.json(output);
  },
);

app.listen(3000);
