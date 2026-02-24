import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth') // เปลี่ยน path เป็น /auth จะได้เรียกง่ายๆ เช่น /auth/signup
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup') // URL จะเป็น POST /auth/signup
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}