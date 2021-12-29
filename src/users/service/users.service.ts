import { UsersRepository } from '../users.repository';
import {
  Injectable,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRequestDto } from '../dto/users.request.dto';
import { User } from '../users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async signUp(body: UserRequestDto) {
    const { email, name, password } = body;
    const isUserExist = await this.usersRepository.existsByEmail(email);

    if (isUserExist) {
      throw new HttpException('해당하는 이메일의 유저가 존재합니다.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.create({
      email,
      name,
      password: hashedPassword,
    });
    return user.readOnlyData;
  }

  async uploadImg(user: User, files: Express.Multer.File[]) {
    const fileName = `users/${files[0].filename}`;
    console.log(fileName);
    const newUser = await this.usersRepository.findByIdAndUploadImg(
      user.id,
      fileName,
    );
    console.log(newUser);
    return newUser;
  }

  async getAllUser() {
    const allUser = await this.usersRepository.findAll();
    const readOnlyUsers = allUser.map((user) => user.readOnlyData);
    return readOnlyUsers;
  }
}
