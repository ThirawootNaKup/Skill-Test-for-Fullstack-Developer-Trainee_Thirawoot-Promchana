import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // 1. เพิ่ม import
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { Todo, TodoSchema } from './schemas/todo.schema'; // 2. เพิ่ม import

@Module({
  imports: [
    // 3. จดทะเบียน Schema ตรงนี้
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}