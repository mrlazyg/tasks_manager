import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './task.model';
// import { Task, TaskStatus } from './task.model';
// import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
// import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService', { timestamp: true });

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    try {
      const { status, search } = filterDto;
      const query = this.tasksRepository.createQueryBuilder('task');
      query.where({ user });

      if (status) {
        query.andWhere('task.status= :status', { status });
      }

      if (search) {
        // const regex = new RegExp(search);
        query.andWhere(
          '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
          { search: `%${search}%` },
        );
      }

      return await query.getMany();
    } catch (error) {
      this.logger.error('Error in getting all task', error.stack);
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(taskId: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: {
        id: taskId,
        user,
      },
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} was not found!`);
    }
    return task;
  }

  async createTask(createTaskObj: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskObj;
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(taskId: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id: taskId, user });
    if (!result?.affected) {
      throw new NotFoundException(`Task with id ${taskId} was not found!`);
    }
  }

  async updateTask(
    taskId: string,
    status: TaskStatus,
    title?: string,
    user?: User,
  ): Promise<Task> {
    const task = await this.getTaskById(taskId, user);
    task.status = status;
    task.title = title || task.title;
    this.tasksRepository.save(task);
    return task;
  }

  // getTaskById(taskId: string): Task {
  //   const task = this.tasks.find((task) => task.id === taskId);
  //   if (!task) {
  //     throw new NotFoundException(`Task with id ${taskId} was not found!`);
  //   }
  //   return task;
  // }

  // getFilteredTasks(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   return tasks;
  // }

  // createTask(createTaskObj: CreateTaskDto): Task {
  //   const { title, description } = createTaskObj;
  //   const task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }

  // deleteTask(taskId: string): void {
  //   this.getTaskById(taskId);
  //   // this.tasks = this.tasks.filter((task) => task.id !== taskId);
  //   const index = this.tasks.findIndex((task) => task.id === taskId);
  //   this.tasks.splice(index, 1);
  // }

  // updateTask(taskId: string, status: TaskStatus, title?: string): Task {
  //   const task = this.getTaskById(taskId);
  //   task.status = status;
  //   task.title = title || task.title;
  //   return task;
  // }
}
