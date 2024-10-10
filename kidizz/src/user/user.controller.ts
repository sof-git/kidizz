import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }

  @Put('/user')
  create(@Body() UserDto: UserDto) {
    return this.userService.create(UserDto);
  }
}
