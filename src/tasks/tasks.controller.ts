import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
// import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User ${user.username} is retrieving all task, filter: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id') taskId: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(taskId, user);
  }

  @Post()
  createTask(
    @Body() createTaskObj: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} is creating a task, payload: ${JSON.stringify(
        createTaskObj,
      )}`,
    );
    return this.tasksService.createTask(createTaskObj, user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id') taskId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTask(taskId, user);
  }

  @Patch('/:id')
  updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status, title } = updateTaskStatusDto;
    return this.tasksService.updateTask(taskId, status, title, user);
  }
}
