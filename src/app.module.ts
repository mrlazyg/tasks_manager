import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import 'dotenv/config';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_DB_HOST,
      port: +process.env.PG_DB_PORT,
      username: process.env.PG_DB_USER,
      password: process.env.PG_DB_PASS,
      database: process.env.PG_DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
      // entities: ['*.entity{.ts, .js}'],
    }),
    AuthModule,
  ],
})
export class AppModule {}
