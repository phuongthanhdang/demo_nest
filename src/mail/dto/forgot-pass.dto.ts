import { Matches } from 'class-validator';

export class ForgotPassword {
  username: string;
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  newPass: string;
}
