import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
// import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') taskId: string): Promise<Task> {
    return this.tasksService.getTaskById(taskId);
  }

  // @Get('/:id')
  // getTaskById(@Param('id') taskId: string): Task {
  //   return this.tasksService.getTaskById(taskId);
  // }

  @Post()
  createTask(@Body() createTaskObj: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskObj);
  }

  @Delete('/:id')
  deleteTask(@Param('id') taskId: string): Promise<void> {
    return this.tasksService.deleteTask(taskId);
  }

  @Patch('/:id')
  updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status, title } = updateTaskStatusDto;
    return this.tasksService.updateTask(taskId, status, title);
  }
}
