import axios from "axios";
import crypto from "node:crypto";
import sinon from "sinon";
import {
  AccountAssetDAO,
  AccountAssetDAODatabase,
} from "../src/AccountAssetDAO";
import {
  AccountDAO,
  AccountDAODatabase,
  AccountDAOMemory,
} from "../src/AccountDAO";
import { AccountService } from "../src/AccountService";
import { Registry } from "../src/Registry";

axios.defaults.validateStatus = () => true;

let accountDAO: AccountDAO;
let accountAssetDAO: AccountAssetDAO;
let accountService: AccountService;
beforeEach(() => {
  // accountDAO = new AccountDAOMemory();
  accountDAO = new AccountDAODatabase();
  accountAssetDAO = new AccountAssetDAODatabase();
  Registry.getInstance().provide("accountDAO", accountDAO);
  Registry.getInstance().provide("accountAssetDAO", accountAssetDAO);
  accountService = new AccountService();
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

test("Deve criar uma conta com stub", async () => {
  const saveStub = sinon.stub(AccountDAODatabase.prototype, "save").resolves();
  const input = {
    name: "John Doe",
    email: "johndoe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const getByIdStub = sinon
    .stub(AccountDAODatabase.prototype, "getById")
    .resolves(input);
  const outputSignup = await accountService.signup(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await accountService.getAccount(
    outputSignup.accountId,
  );
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.document).toBe(input.document);
  expect(outputGetAccount.password).toBe(input.password);
  saveStub.restore();
  getByIdStub.restore();
});

test("Deve criar uma conta com spy", async () => {
  const saveSpy = sinon.spy(AccountDAODatabase.prototype, "save");
  const getByIdSpy = sinon.spy(AccountDAODatabase.prototype, "getById");
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
  expect(saveSpy.calledOnce).toBe(true);
  expect(getByIdSpy.calledWith(outputSignup.accountId)).toBe(true);
  expect(getByIdSpy.calledOnce).toBe(true);
  saveSpy.restore();
  getByIdSpy.restore();
});

test("Deve criar uma conta com mock", async () => {
  const accountDAOMock = sinon.mock(AccountDAODatabase.prototype);
  accountDAOMock.expects("save").once().resolves();
  const input = {
    name: "John Doe",
    email: "johndoe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  accountDAOMock.expects("getById").once().resolves(input);
  const outputSignup = await accountService.signup(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await accountService.getAccount(
    outputSignup.accountId,
  );
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.document).toBe(input.document);
  expect(outputGetAccount.password).toBe(input.password);
  accountDAOMock.verify();
  accountDAOMock.restore();
});

test("Deve criar uma conta com fake", async () => {
  const accountDAO = new AccountDAOMemory();
  Registry.getInstance().provide("accountDAO", accountDAO);
  accountService = new AccountService();
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

test("Deve depositar em uma conta", async () => {
  const input = {
    name: "John Doe",
    email: "johndoe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const outputSignup = await accountService.signup(input);
  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "USD",
    quantity: 1000,
  };
  await accountService.deposit(inputDeposit);
  const outputGetAccount = await accountService.getAccount(
    outputSignup.accountId,
  );
  expect(outputGetAccount.balances[0].asset_id).toBe("USD");
  expect(outputGetAccount.balances[0].quantity).toBe("1000");
});

test("Nao deve depositar em uma conta que não existe", async () => {
  const inputDeposit = {
    accountId: crypto.randomUUID(),
    assetId: "USD",
    quantity: 1000,
  };
  await expect(() => accountService.deposit(inputDeposit)).rejects.toThrow(
    new Error("Account not found"),
  );
});

test("Deve sacar de uma conta", async () => {
  const input = {
    name: "John Doe",
    email: "johndoe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const outputSignup = await accountService.signup(input);
  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "USD",
    quantity: 1000,
  };
  await accountService.deposit(inputDeposit);
  const inputWithdraw = {
    accountId: outputSignup.accountId,
    assetId: "USD",
    quantity: 500,
  };
  await accountService.withdraw(inputWithdraw);
  const outputGetAccount = await accountService.getAccount(
    outputSignup.accountId,
  );
  expect(outputGetAccount.balances[0].asset_id).toBe("USD");
  expect(outputGetAccount.balances[0].quantity).toBe("500");
});

test("Nao deve sacar de uma conta se não tiver saldo", async () => {
  const input = {
    name: "John Doe",
    email: "johndoe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const outputSignup = await accountService.signup(input);
  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "USD",
    quantity: 500,
  };
  await accountService.deposit(inputDeposit);
  const inputWithdraw = {
    accountId: outputSignup.accountId,
    assetId: "USD",
    quantity: 1000,
  };
  await expect(() => accountService.withdraw(inputWithdraw)).rejects.toThrow(
    new Error("Insuficient funds"),
  );
});
