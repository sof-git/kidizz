import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { ChildCare } from './childCare/childCare.entity';
import { ChildCareService } from './childCare/childCare.service';
import { ChildCareController } from './childCare/childCare.controller';
import { Child } from './child/child.entity';
import { ChildService } from './child/child.service';
import { ChildController } from './child/child.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'kidizz',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, ChildCare, Child]),
  ],
  controllers: [UserController, ChildCareController, ChildController],
  providers: [UserService, ChildCareService, ChildService],
})
export class AppModule {}
