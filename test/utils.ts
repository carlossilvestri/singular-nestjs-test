import { CreateUserDto } from '../src/users/dto/create-user.dto';

export const userAdmin: CreateUserDto = {
  email: 'test@example.com',
  password: '$2b$10$4KXr.qChGtoo5b8aYQNuH.L5cWLDIXz/N2ollt5vttSSquHD9Ng2C', //password = test123
  name: 'Jordi',
  lastname: 'Cher',
};

export const userLogin = {
  ...userAdmin,
  password: 'test123',
};

export const userCustomer = {
  email: 'test@customer.com',
  password: 'test123',
  name: 'Jordi',
  lastname: 'Cher',
};
