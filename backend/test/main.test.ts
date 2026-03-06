import axios from 'axios'

axios.defaults.validateStatus = () => true;

test('Deve criar uma conta', async () => {
  const input = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    document: '97456321558',
    password: 'asdQWE123'
  }
  const responseSignup = await axios.post('http://localhost:3000/signup', input);
  const outputSignup = responseSignup.data;
  expect(outputSignup.accountId).toBeDefined();
  const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
  const outputGetAccount = responseGetAccount.data;
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.document).toBe(input.document);
  expect(outputGetAccount.password).toBe(input.password);
});

test('Nao deve criar uma conta se o nome for invalido', async () => {
  const input = {
    name: 'John',
    email: 'johndoe@gmail.com',
    document: '97456321558',
    password: 'asdQWE123'
  }
  const responseSignup = await axios.post('http://localhost:3000/signup', input);
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe('Invalid name')
});

test('Nao deve criar uma conta se o email for invalido', async () => {
  const input = {
    name: 'John Doe',
    email: 'johndoe@gmail',
    document: '97456321558',
    password: 'asdQWE123'
  }
  const responseSignup = await axios.post('http://localhost:3000/signup', input);
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe('Invalid email')
});

test('Nao deve criar uma conta se o documento for invalido', async () => {
  const input = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    document: '9745632155',
    password: 'asdQWE123'
  }
  const responseSignup = await axios.post('http://localhost:3000/signup', input);
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe('Invalid document')
});

test('Nao deve criar uma conta se a senha tiver menos de 8 caracteres', async () => {
  const input = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    document: '97456321558',
    password: 'asdQWE'
  }
  const responseSignup = await axios.post('http://localhost:3000/signup', input);
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe('Invalid password')
});
