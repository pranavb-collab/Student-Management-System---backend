import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TeacherController } from './teachers/teachers.controller';
import { TeacherModule } from './teachers/teachers.module';
import { StudentModule } from './students/students.module';
import { StudentController } from './students/students.controller';
import { ClassController } from './class/class.controller';
import { ClassService } from './class/class.service';
import { ClassModule } from './class/class.module';
import { SubjectController } from './subject/subject.controller';
import { SubjectService } from './subject/subject.service';
import { SubjectModule } from './subject/subject.module';
import { EventsModule } from './events/events.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
   MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
 MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
      }),
    }),
   AuthModule,
   TeacherModule,
   StudentModule,
   ClassModule,
   SubjectModule,
   EventsModule,
  ],
  controllers: [AppController, TeacherController, StudentController, ClassController, SubjectController],
  providers: [AppService],
})
export class AppModule {}