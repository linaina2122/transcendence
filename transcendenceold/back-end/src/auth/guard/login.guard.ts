import { AuthGuard } from '@nestjs/passport';

export class LoginGuard extends AuthGuard('refresh_token') {
  constructor() {
    super();
  }
}
