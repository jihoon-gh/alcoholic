import { multerOptions } from '../../common/utils/multer.options';
import { AuthService } from '../../auth/auth.service';
import { positiveIntPipe } from '../../common/pipes/positiveintpipe';
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
  Req,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.fillter';
import { UserRequestDto } from '../dto/users.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { readOnlyUserDto } from '../dto/users.dto';
import { loginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Request } from 'express';
import { CurrentUser } from 'src/common/decorators/user.decorators';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { User } from '../users.schema';
@Controller('users')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 유저 정보' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@CurrentUser() user) {
    return user.readOnlyData;
  }

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
  login(@Body() data: loginRequestDto) {
    return this.authService.jwtLogin(data);
  }

  @ApiOperation({ summary: '이미지 업로드-> 필수 기능 아니라고 판단' })
  @UseInterceptors(FilesInterceptor('image', 10, multerOptions('users')))
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  uploadImg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: User,
  ) {
    console.log(files);
    //return { image: `http://localhost:3000/media/users/${files[0].filename}` };
    return this.usersService.uploadImg(user, files);
  }

  @ApiOperation({ summary: '모든 유저들 가져오기' })
  @Get('all')
  getAllCat() {
    return this.usersService.getAllUser();
  }
}
