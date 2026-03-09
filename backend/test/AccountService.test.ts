import axios from "axios";
import {
  AccountDAO,
  AccountDAOMemory
} from "../src/AccountDAO";
import { AccountService } from "../src/AccountService";

axios.defaults.validateStatus = () => true;

let accountDAO: AccountDAO;
let accountService: AccountService;
beforeEach(() => {
  accountDAO = new AccountDAOMemory();
  accountService = new AccountService(accountDAO);
});

test("Deve criar uma conta", async () => {
  const input = {
    name: "John Doe",
    email: "johndoe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const outputSignup = await accountService.signup(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await accountService.getAccount(
    outputSignup.accountId,
  );
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.document).toBe(input.document);
  expect(outputGetAccount.password).toBe(input.password);
});

test("Nao deve criar uma conta se o nome for invalido", async () => {
  const input = {
    name: "John",
    email: "johndoe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  await expect(() => accountService.signup(input)).rejects.toThrow(
    new Error("Invalid name"),
  );
});

test("Nao deve criar uma conta se o email for invalido", async () => {
  const input = {
    name: "John Doe",
    email: "johndoe@gmail",
    document: "97456321558",
    password: "asdQWE123",
  };
  await expect(() => accountService.signup(input)).rejects.toThrow(
    new Error("Invalid email"),
  );
});

test("Nao deve criar uma conta se o documento for invalido", async () => {
  const input = {
    name: "John Doe",
    email: "johndoe@gmail.com",
    document: "9745632155",
    password: "asdQWE123",
  };
  await expect(() => accountService.signup(input)).rejects.toThrow(
    new Error("Invalid document"),
  );
});

test("Nao deve criar uma conta se a senha tiver menos de 8 caracteres", async () => {
  const input = {
    name: "John Doe",
    email: "johndoe@gmail.com",
    document: "97456321558",
    password: "asdQWE",
  };
  await expect(() => accountService.signup(input)).rejects.toThrow(
    new Error("Invalid password"),
  );
});
