import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { async } from 'rxjs';
import { configValidationSchema } from './config.schema';
import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';
import { SessionModule } from './session/session.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { CheckEmailModule } from './check-email/check-email.module';
import { LoaiSpModule } from './loai-sp/loai-sp.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.stage.dev',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string().default('development'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      }),
    }),
    TasksModule,
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   // host: 'localhost',
    //   // port: 5432,
    //   // username: 'postgres',
    //   // password: 'Bstar@2022',
    //   // database: 'nestjs_project',
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
    AuthModule,
    DatabaseModule,
    MailModule,
    SessionModule,
    ProductModule,
    CartModule,
    CheckEmailModule,
    LoaiSpModule,
  ],
})
export class AppModule {}
