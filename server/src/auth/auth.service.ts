import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

 
  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    
    // 2. ถ้าไม่เจอ User หรือ รหัสผ่านไม่ตรงกัน
    // ใช้ ?.password เพื่อป้องกันกรณี user เป็น null
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }

    // 3. สร้าง Token
    // ใช้ (user as any)._id เพื่อแก้ปัญหา TypeScript หา _id ไม่เจอชั่วคราว
    const payload = { sub: (user as any)._id, username: user.username };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}