import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildCare } from './childCare.entity';
import { ChildCareController } from './childCare.controller';
import { ChildCareService } from './childCare.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildCare])],
  controllers: [ChildCareController],
  providers: [ChildCareService],
  exports: [ChildCareService],
})
export class ChildCareModule {}
