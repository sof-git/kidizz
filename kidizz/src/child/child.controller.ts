import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Headers,
  Param,
  HttpCode,
  HttpStatus,
  Delete,
  HttpException,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { ChildService } from './child.service';
import { ChildDto } from './child.dto';
import { UserService } from '../user/user.service';

@Controller('child')
export class ChildController {
  constructor(
    private readonly childService: ChildService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createChild(
    @Body() createChildDto: ChildDto,
    @Headers('X-Auth') username: string,
  ) {
    const userId = await this.userService.getUserIdByUsername(username);
    return this.childService.create(createChildDto, userId);
  }

  @Get('/child-care/:id/children')
  async getChildrenByChildCare(@Param('id') id: number) {
    return this.childService.getChildrenByChildCare(Number(id));
  }

  @Put('/child-care/:childCareId/child/:childId')
  async updateChildCare(
    @Param('childId') childId: number,
    @Param('childCareId') childCareId: number,
    @Headers('X-Auth') username: string,
  ) {
    const userId = await this.userService.getUserIdByUsername(username);
    return this.childService.removeChildCare(
      Number(childId),
      Number(childCareId),
      userId,
    );
  }

  @Delete(':id')
  async deleteChild(
    @Headers('X-Auth') username: string,
    @Param('id') id: number,
  ) {
    const userId = await this.userService.getUserIdByUsername(username);
    const child = await this.childService.findOne(id);

    // Ensure the child belongs to the user
    if (child.userId !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.childService.delete(id);
  }
  @Get('/children/export.csv')
  async exportChildren(
    @Res() res: Response,
    @Query('childCareId') childCareId?: number, // Optional query parameter
  ) {
    try {
      // Set CSV headers and response type for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=children_export.csv',
      );

      // Get the CSV stream from the service
      const csvStream =
        await this.childService.getChildrenForExport(childCareId); // Pass childCareId here

      // Pipe the CSV stream to the response
      csvStream.pipe(res);

      // Handle errors in streaming
      csvStream.on('error', (error) => {
        console.error('Error while streaming CSV:', error);
        if (!res.headersSent) {
          res.status(500).send('Failed to stream CSV data.');
        }
      });
    } catch (error) {
      console.error('Error exporting children as CSV:', error);

      // Ensure that the response is not modified after headers are sent
      if (!res.headersSent) {
        res.status(500).send('Failed to export children as CSV.');
      }
    }
  }
}
