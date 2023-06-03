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
import { TaskStatus } from './task.model';
// import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // @Get()
  // getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //   if (Object.keys(filterDto).length) {
  //     return this.tasksService.getFilteredTasks(filterDto);
  //   }
  //   return this.tasksService.getAllTasks();
  // }

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

  // @Post()
  // createTask(@Body() createTaskObj: CreateTaskDto): Task {
  //   return this.tasksService.createTask(createTaskObj);
  // }

  // @Delete('/:id')
  // deleteTask(@Param('id') taskId: string): void {
  //   return this.tasksService.deleteTask(taskId);
  // }

  // @Patch('/:id')
  // updateTask(
  //   @Param('id') taskId: string,
  //   @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  // ): Task {
  //   const { status, title } = updateTaskStatusDto;
  //   return this.tasksService.updateTask(taskId, status, title);
  // }
}
