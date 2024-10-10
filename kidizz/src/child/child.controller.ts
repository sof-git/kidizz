import {
  Controller,
  Post,
  Get,
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
import { Stream } from 'stream';
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
  @Get('export.csv')
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

      // Create a stream to write the CSV data
      const csvStream = new Stream.PassThrough();

      // Start piping the CSV stream to the response
      csvStream.pipe(res);

      // Write CSV headers to the stream
      csvStream.write('ID, Firstname, Lastname, ChildCareID\n');

      // Get children data based on `childCareId` from the service
      const children =
        await this.childService.getChildrenForExport(childCareId);

      // Use a Set to keep track of unique children (no duplicates)
      const seenChildren = new Set<number>();

      // Write each child record to the CSV stream, ensuring no duplicates
      for (const child of children) {
        if (!seenChildren.has(child.id)) {
          seenChildren.add(child.id);

          // If `childCareId` is provided, use it. Otherwise, join all `childCareIds` as a string.
          const childCareField = childCareId
            ? child.childCareIds?.includes(childCareId)
              ? childCareId
              : ''
            : child.childCareIds?.length > 0
              ? child.childCareIds.join(', ')
              : ''; // Use empty string if `childCareIds` is undefined or empty

          // Construct the CSV line and write it to the stream
          const line = `${child.id},${child.firstname},${child.lastname},${childCareField}\n`;
          csvStream.write(line);
        }
      }

      // End the CSV stream once all data has been written
      csvStream.end();
    } catch (error) {
      console.error('Error exporting children as CSV:', error);

      // Ensure that the response is not modified after headers are sent
      if (!res.headersSent) {
        res.status(500).send('Failed to export children as CSV.');
      }
    }
  }
}
