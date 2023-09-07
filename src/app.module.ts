import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

// console.log(process.env.NODE_ENV);
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    // ? ConfigModule.forRoot({ envFilePath: [`.env.${process.env.NODE_ENV}`] }),
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
      // ? entities: ['*.entity{.ts, .js}'],
    }),
    // ? Configuration for ConfigModule
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => {
    //     return {
    //       type: 'postgres',
    //       host: configService.get('POSTGRES_HOST'),
    //       port: configService.get('POSTGRES_PORT'),
    //       username: configService.get('POSTGRES_USER'),
    //       password: configService.get('POSTGRES_PASSWORD'),
    //       database: configService.get('POSTGRES_DATABASE'),
    //       autoLoadEntities: true,
    //       synchronize: true,
    //       ssl: true,
    //     };
    //   },
    // }),
    AuthModule,
  ],
})
export class AppModule {}
