import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'; // เพิ่ม import MongooseSchema
import { User } from '../../users/schemas/user.schema'; // import User

export type TodoDocument = HydratedDocument<Todo>;

export enum TodoStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Schema({ timestamps: true })
export class Todo {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: TodoStatus.PENDING })
  status: TodoStatus;

  @Prop()
  category: string;

  @Prop()
  dueDate: Date;

  @Prop([String])
  assignees: string[];

  // ✅ เพิ่ม field นี้: เก็บ ID ของคนสร้าง
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  owner: User;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);