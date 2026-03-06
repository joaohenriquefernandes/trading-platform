import { validateEmail } from "../src/validateEmail";

test.each([
  'john.doe@gmail.com'
])('Deve validar o email %s', (email: string) => {
  const isValid = validateEmail(email);
  expect(isValid).toBe(true);
});

test.each([
  'john.doe@gmail',
  'john.doegmail.com',
  'john@',
])('Nao deve validar o email %s', (email: string) => {
  const isValid = validateEmail(email);
  expect(isValid).toBe(false);
});
