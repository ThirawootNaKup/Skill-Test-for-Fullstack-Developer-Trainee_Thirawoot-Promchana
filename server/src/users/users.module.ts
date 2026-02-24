import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // 1. เพิ่ม import
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema'; // 2. เพิ่ม import

@Module({
  imports: [
    // 3. จดทะเบียน Schema
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export service เพื่อให้ Module อื่น (Auth) เรียกใช้ได้ในอนาคต
})
export class UsersModule {}