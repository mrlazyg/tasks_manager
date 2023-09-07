import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
});

const mockUser = {
  username: 'john',
  id: 'dummyId',
  password: 'dummy password',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  // let tasksRepository: TasksRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        // { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    // tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('get all tasks', () => {
      expect(tasksService.getTasks).not.toHaveBeenCalled();
      tasksService.getTasks(null, mockUser);
      expect(tasksService.getTasks).toHaveBeenCalled();
    });
  });
});
