import { TodoStatus } from '../schemas/todo.schema';

export class CreateTodoDto {
  title: string;
  description?: string;
  status?: TodoStatus;
  category?: string;
  dueDate?: Date;
  assignees?: string[];
}