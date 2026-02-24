import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './schemas/todo.schema';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  // ✅ เปลี่ยน user: User เป็น user: any
  async create(createTodoDto: CreateTodoDto, user: any): Promise<Todo> {
    // ใช้ user.userId (ตามที่ JwtStrategy ส่งมา)
    const data = Object.assign(createTodoDto, { owner: user.userId });
    const createdTodo = new this.todoModel(data);
    return createdTodo.save();
  }

  // ✅ เปลี่ยน user: User เป็น user: any
  async findAll(user: any, keyword?: string, category?: string, status?: string): Promise<Todo[]> {
    // ใช้ user.userId ในการกรอง
    const filter: any = { owner: user.userId }; 

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (category) filter.category = category;
    if (status) filter.status = status;

    return this.todoModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  // ... (ฟังก์ชันอื่นเหมือนเดิม) ...
  async findOne(id: string) { return this.todoModel.findById(id).exec(); }
  async update(id: string, updateTodoDto: UpdateTodoDto) { return this.todoModel.findByIdAndUpdate(id, updateTodoDto, { new: true }).exec(); }
  async remove(id: string) { return this.todoModel.findByIdAndDelete(id).exec(); }
}