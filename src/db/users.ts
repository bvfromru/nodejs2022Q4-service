import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/user/dto/update-user.dto';

export class Users {
  users: any[];
  constructor() {
    this.users = [];
  }

  findAll = () => this.users;

  create = (createUserDto: CreateUserDto) => {
    this.users.push(createUserDto);
  };

  updatePassword = (updatePasswordDto: UpdatePasswordDto) => {
    console.log(updatePasswordDto);
  };
}
