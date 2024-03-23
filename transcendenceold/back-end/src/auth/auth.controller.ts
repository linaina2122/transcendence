import {
  Controller,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  UseGuards,
  Request,
  Logger,
  Redirect,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { GetUser } from 'src/decorators';
import { User } from '@prisma/client';
import { AccessGuard, IntraGuard, LoginGuard } from './guard';
import { Tokens } from 'src/types';
import { IntraUserDto } from './dto';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @UseGuards(LoginGuard, AccessGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Get('/logout')
  async logout(@GetUser() user: User, @Res() res: Response): Promise<any> {
    // logout from the server

    this.authService.logout(user);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    this.logger.log(`User ${user.username} Is logged out `);

    return res.status(HttpStatus.OK).json({ message: 'done' });
  }

  @UseGuards(IntraGuard)
  @Get('42')
  async loginIntraNe(@Request() req) {
    return;
  }

  @UseGuards(IntraGuard)
  @Get('42/callback')
  @Redirect(`http://${process.env.IP}:3000/settings/`)
  async loginIntraNew(@Request() req, @Res() res: Response) {

    const { usual_full_name, username, email } = req.user;

    const link = 'public/avatars/default.png';

    const extractedData: IntraUserDto = new IntraUserDto();

    // store the data
    extractedData.login = username;
    extractedData.fullName = usual_full_name;
    extractedData.avatarUrl = link;
    extractedData.email = email;

    const tokens: Tokens = await this.authService.loginInra(extractedData);

    res.cookie('access_token', tokens.access_token, { httpOnly: false });
    res.cookie('refresh_token', tokens.refresh_token, { httpOnly: false });

    this.logger.log(`User ${username} Is logged In `);

    return;
  }

  @UseGuards(LoginGuard)
  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  async refresh(@Res() res: Response, @GetUser() user: User) {
    const tokens: Tokens = await this.authService.refreshToken(user);

    this.logger.log(`${user.username} is back to the server `)


    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    res.cookie('access_token', tokens.access_token, { httpOnly: false });
    res.cookie('refresh_token', tokens.refresh_token, { httpOnly: false });

    return res.status(HttpStatus.OK).json({ message: 'done', access_token: tokens.access_token, refresh_token: tokens.refresh_token });
  }
}
