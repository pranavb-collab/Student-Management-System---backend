import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TeachersController } from './teachers/teachers.controller';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { StudentsController } from './students/students.controller';
@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
   MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
   AuthModule,
   TeachersModule,
   StudentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
