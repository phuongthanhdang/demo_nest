import { Module } from '@nestjs/common';
import { CheckEmailService } from './check-email.service';
import { CheckEmail } from './check-email.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckEmailController } from './check-email.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CheckEmail])],
  providers: [CheckEmailService],
  exports: [CheckEmailService],
  controllers: [CheckEmailController],
})
export class CheckEmailModule {}
