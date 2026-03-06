import { validateName } from "../src/validateName";

test.each([
  'John Doe',
  'John Doe Xy'
])('Deve validar o nome %s', (name: string) => {
  const isValid = validateName(name);
  expect(isValid).toBe(true);
});

test.each([
  'John',
  ''
])('Nao deve validar o nome %s', (name: string) => {
  const isValid = validateName(name);
  expect(isValid).toBe(false);
});
