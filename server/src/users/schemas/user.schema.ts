import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true }) // unique: true ห้ามชื่อซ้ำ
  username: string;

  @Prop({ required: true })
  password: string; // เก็บแบบ Hash (เข้ารหัสแล้ว)
}

export const UserSchema = SchemaFactory.createForClass(User);