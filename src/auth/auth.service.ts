import { UsersRepository } from './../users/users.repository';
import { HttpException, Injectable } from '@nestjs/common';
import { loginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogin(data: loginRequestDto) {
    const { email, password } = data;

    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      throw new HttpException('이메일을 확인해주세요', 403);
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    if (!isPasswordValidated) {
      throw new HttpException('비밀번호를 확인해주세요', 403);
    }
    const payload = {
      email: email,
      sub: user.id,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
