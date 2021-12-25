import { positiveIntPipe } from './../common/pipes/positiveintpipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.fillter';
import { UserRequestDto } from './dto/users.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { readOnlyUserDto } from './dto/users.dto';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '현재 유저 정보' })
  @Get()
  getCurrentUser() {}

  @ApiResponse({
    status: 500,
    description: 'server error..',
  })
  @ApiResponse({
    status: 200,
    description: 'success!',
    type: readOnlyUserDto,
  })
  @ApiOperation({ summary: '회원가입 진행' })
  @Post()
  async signUp(@Body() body: UserRequestDto) {
    return await this.usersService.signUp(body);
  }

  @ApiOperation({ summary: '회원 로그인' })
  @Post('login')
  login() {}

  @Post('logout')
  logout() {}

  @ApiOperation({ summary: '이미지 업로드-> 필수 기능 아니라고 판단' })
  @Post('upload')
  uploadImg() {}
}
