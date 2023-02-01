import { Users } from './users';

class Database {
  users: Users;
  constructor() {
    this.users = new Users();
  }
}

export const db = new Database();
