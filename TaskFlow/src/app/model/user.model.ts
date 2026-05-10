export class User {
  username: string;
  password: string;
  name: string;

  constructor(username: string, password: string, name: string) {
    this.username = username;
    this.password = password;
    this.name = name;
  }
}