import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
// import { Injectable } from '@nestjs/common';

@EntityRepository()
export class TasksRepository extends Repository<Task> {}

// @Injectable()
// export class TasksRepository extends Repository<Task> {
//   constructor(private dataSource: DataSource) {
//     super(Task, dataSource.createEntityManager());
//   }
// }
