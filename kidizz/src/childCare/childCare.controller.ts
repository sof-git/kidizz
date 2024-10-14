import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Headers,
  HttpCode,
  HttpStatus,
  HttpException,
  Param,
} from '@nestjs/common';
import { ChildCareService } from './childCare.service';
import { ChildCareDto } from './childCare.dto';
import { UserService } from '../user/user.service';

@Controller('child-care')
export class ChildCareController {
  constructor(
    private readonly childCareService: ChildCareService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createChildCare(
    @Body() createChildCareDto: ChildCareDto,
    @Headers('X-Auth') username: string,
  ) {
    const userId = await this.userService.getUserIdByUsername(username);
    return this.childCareService.create(createChildCareDto, userId);
  }

  @Delete(':id')
  async deleteChildCare(
    @Headers('X-Auth') username: string,
    @Param('id') id: number,
  ) {
    const userId = await this.userService.getUserIdByUsername(username);
    const childCare = await this.childCareService.findOne(id);

    // Ensure the child care belongs to the user
    if (childCare.userId !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.childCareService.delete(id, userId);
  }

  @Get()
  async getAllChildCare() {
    return this.childCareService.findAll();
  }
}
