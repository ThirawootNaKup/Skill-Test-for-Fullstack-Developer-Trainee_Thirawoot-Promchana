import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema'; // <--- บรรทัดที่เคยขาดไป

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    // 1. เช็คว่า Username ซ้ำไหม
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // 2. เข้ารหัส Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. บันทึก
    const createdUser = new this.userModel({
      username,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findOne(username: string): Promise<User | undefined> {
    // แก้ไข Type ให้รองรับกรณีหาไม่เจอ (null)
    const user = await this.userModel.findOne({ username }).exec();
    return user ? user : undefined;
  }
}