import {
  Injectable,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRequestDto } from './dto/users.request.dto';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async signUp(body: UserRequestDto) {
    const { email, name, password } = body;
    const isUserExist = await this.userModel.exists({ email });

    if (isUserExist) {
      throw new HttpException('해당하는 이메일의 유저가 존재합니다.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      email,
      name,
      password: hashedPassword,
    });
    return user.readOnlyData;
  }
}
