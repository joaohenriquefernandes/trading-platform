import { randomUUID } from "node:crypto";
import { AccountDAO } from "./AccountDAO";
import { validateCpf } from "./validateCpf";
import { validateEmail } from "./validateEmail";
import { validateName } from "./validateName";
import { validatePassword } from "./validatePassword";
export class AccountService {
  constructor(private readonly accountDAO: AccountDAO) {}

  async signup(account: any) {
    account.accountId = randomUUID();
    if (!validateName(account.name)) throw new Error("Invalid name");
    if (!validateEmail(account.email)) throw new Error("Invalid email");
    if (!validateCpf(account.document)) throw new Error("Invalid document");
    if (!validatePassword(account.password))
      throw new Error("Invalid password");
    await this.accountDAO.save(account);
    return {
      accountId: account.accountId,
    };
  }

  async getAccount(accountId: string) {
    const account = await this.accountDAO.getById(accountId);
    return account;
  }
}
