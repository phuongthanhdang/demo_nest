import { Body, Controller, Get } from '@nestjs/common';
import { CheckEmailService } from './check-email.service';
import { CheckEmailDto } from './dto/check-email.dto';

@Controller('check-email')
export class CheckEmailController {
  constructor(private checkEmailService: CheckEmailService) {}
  @Get()
  getCheckEmail(@Body() checkEmailDto: CheckEmailDto) {
    return this.checkEmailService.getCheckEmail(
      checkEmailDto.iv,
      checkEmailDto.encryptedData,
    );
  }
}
