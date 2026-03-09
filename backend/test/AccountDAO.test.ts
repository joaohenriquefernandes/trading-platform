import axios from "axios";
import crypto from "node:crypto";
import { AccountDAODatabase } from "../src/AccountDAO";

axios.defaults.validateStatus = () => true;

test("Deve persistir uma conta", async () => {
  const accountDAO = new AccountDAODatabase();
  const account = {
    accountId: crypto.randomUUID(),
    name: "John Doe",
    email: "johndoe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  await accountDAO.save(account);
  const savedAccount = await accountDAO.getById(account.accountId);
  expect(savedAccount.account_id).toBe(account.accountId);
  expect(savedAccount.name).toBe(account.name);
  expect(savedAccount.email).toBe(account.email);
  expect(savedAccount.document).toBe(account.document);
  expect(savedAccount.password).toBe(account.password);
});
