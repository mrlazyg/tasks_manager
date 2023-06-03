import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
// import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
// import { Injectable } from '@nestjs/common';

@EntityRepository()
export class TasksRepository extends Repository<Task> {
  //   async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
  //     const query = this.createQueryBuilder('task');
  //     const tasks = await query.getMany();
  //     return tasks;
  //   }
}

// @Injectable()
// export class TasksRepository extends Repository<Task> {
//   constructor(private dataSource: DataSource) {
//     super(Task, dataSource.createEntityManager());
//   }
// }
