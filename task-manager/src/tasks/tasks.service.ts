import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
// import { Task, TaskStatus } from './task.model';
// import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
// import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.tasksRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status= :status', { status });
    }

    if (search) {
      // const regex = new RegExp(search);
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    return await query.getMany();
  }

  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: {
        id: taskId,
      },
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} was not found!`);
    }
    return task;
  }

  async createTask(createTaskObj: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskObj;
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(taskId: string): Promise<void> {
    const result = await this.tasksRepository.delete({ id: taskId });
    if (!result?.affected) {
      throw new NotFoundException(`Task with id ${taskId} was not found!`);
    }
  }

  async updateTask(
    taskId: string,
    status: TaskStatus,
    title?: string,
  ): Promise<Task> {
    const task = await this.getTaskById(taskId);
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
