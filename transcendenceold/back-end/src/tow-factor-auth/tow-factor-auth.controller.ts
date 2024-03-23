import {
  Controller,
  Get,
  UseGuards,
  Res,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorators';
import { TowFactorAuthService } from './tow-factor-auth.service';
import { AccessGuard, LoginGuard } from 'src/auth/guard';

@UseGuards(AccessGuard, LoginGuard)
@Controller('tow-factor-auth')
export class TowFactorAuthController {
  private logger = new Logger(TowFactorAuthController.name);
  constructor(private towFactorAuthService: TowFactorAuthService) {}

  @Get('/validated')
  async validate(@GetUser('id') userId: string) {
    return this.towFactorAuthService.validate(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/confirm/:code')
  async confirm(@GetUser('id') userId: string, @Param('code') code: string): Promise<{ message: string } | User> {
    return this.towFactorAuthService.confirm(userId, code);
  }
}
