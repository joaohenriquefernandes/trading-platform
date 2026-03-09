import axios from "axios";
import crypto from "node:crypto";
import { getAccountById, saveAccount } from "../src/data";

axios.defaults.validateStatus = () => true;

test("Deve persistir uma conta", async () => {
  const account = {
    accountId: crypto.randomUUID(),
    name: "John Doe",
    email: "johndoe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  await saveAccount(account);
  const savedAccount = await getAccountById(account.accountId);
  expect(savedAccount.account_id).toBe(account.accountId);
  expect(savedAccount.name).toBe(account.name);
  expect(savedAccount.email).toBe(account.email);
  expect(savedAccount.document).toBe(account.document);
  expect(savedAccount.password).toBe(account.password);
});
