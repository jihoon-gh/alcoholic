import { positiveIntPipe } from './../common/pipes/positiveintpipe';
import {
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

@Controller('users')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  allUsers() {}

  @Get(':id')
  oneUser(@Param('id', ParseIntPipe, positiveIntPipe) param: Number) {
    console.log(param);
    console.log(typeof param);
    return 'one cat';
  }

  @Post()
  createUser() {}

  @Put()
  updateUser() {}

  @Patch(':id')
  updateOneUser() {}

  @Delete(':id')
  deleteUser() {}
}
