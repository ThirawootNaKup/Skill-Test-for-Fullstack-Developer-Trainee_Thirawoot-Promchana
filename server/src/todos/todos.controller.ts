import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from '@nestjs/passport'; // 1. นำเข้า Guard

@Controller('todos')
@UseGuards(AuthGuard('jwt')) // 2. ล็อคประตูทั้ง Controller (ต้องมี Token ถึงเข้าได้)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Request() req, @Body() createTodoDto: CreateTodoDto) {
    // 3. ส่ง req.user ไปให้ Service
    return this.todosService.create(createTodoDto, req.user);
  }

  @Get()
  findAll(
    @Request() req, // 4. รับ User จาก Token
    @Query('search') search: string,
    @Query('category') category: string,
    @Query('status') status: string,
  ) {
    return this.todosService.findAll(req.user, search, category, status);
  }

  // ... (API อื่นๆ ปล่อยไว้เหมือนเดิมก็ได้ หรือจะล็อคด้วยก็ได้)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }
}