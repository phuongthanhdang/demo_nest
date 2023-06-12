import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import User from 'src/auth/user.entity';
import { ResetPass } from './dto/resetPass.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    // const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.username,
        // url,
      },
    });
  }
  async sendPassResetLink(resetPass: ResetPass, user: User) {
    const url = `example.com/auth/confirm?username=${user.username}`;
    await this.mailerService.sendMail({
      to: resetPass.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './forgot', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        email: resetPass.email,
        url,
      },
    });
  }
}
