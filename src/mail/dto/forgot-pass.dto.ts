import { Matches } from 'class-validator';

export class ForgotPassword {
  iv: string;
  encryptedData: string;
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  newPass: string;
}
