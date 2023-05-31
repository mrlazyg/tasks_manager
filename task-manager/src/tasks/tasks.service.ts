import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(taskId: string): Task {
    const task = this.tasks.find((task) => task.id === taskId);
    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} was not found!`);
    }
    return task;
  }

  getFilteredTasks(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    return tasks;
  }

  createTask(createTaskObj: CreateTaskDto): Task {
    const { title, description } = createTaskObj;

    const task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);

    return task;
  }

  deleteTask(taskId: string): void {
    this.getTaskById(taskId);
    // this.tasks = this.tasks.filter((task) => task.id !== taskId);
    const index = this.tasks.findIndex((task) => task.id === taskId);
    this.tasks.splice(index, 1);
  }

  updateTask(taskId: string, status: TaskStatus, title?: string): Task {
    const task = this.getTaskById(taskId);
    task.status = status;
    task.title = title || task.title;
    return task;
  }
}
