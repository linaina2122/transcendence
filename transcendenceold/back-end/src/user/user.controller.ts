import { User } from '@prisma/client';
import { UserService } from './user.service';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  Put,
  Logger,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { GetUser } from 'src/decorators';
import { AccessGuard, LoginGuard } from 'src/auth/guard';
import { UpdateUserData } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';

@UseGuards(AccessGuard, LoginGuard)
@Controller('users')
export class UserController {

  private logger = new Logger();

  constructor(private userService: UserService) {}

  @Get('/me')
  async getMe(@GetUser() user: User) {
    this.logger.debug(`User ${user.username}`)
    return user;
  }

  @Get('/:userId')
  async getUser(@Param('userId') userId: string): Promise<User> {
    return await this.userService.getUser(userId);
  }

  @Put('/update')
  async updateUser(@Body() dataUser: UpdateUserData, @GetUser('id') userId: string) {
    return this.userService.updateUser(dataUser, userId);
  }

  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile( @UploadedFile() file: Express.Multer.File, @GetUser('id') userId: string ): Promise< User | null > {
      try {
        
        if (file) {
          
          const uploadFolder = 'public/avatars/';
          
          const uniqueFileName = `${userId}-tran.png`;
          
          const filePath: string = path.join(uploadFolder, uniqueFileName);
          
          await fs.promises.writeFile(filePath, file.buffer);
          
          // we need to update the user avatar name

          const user: User | null = await this.userService.updateUserAvatarName(userId, filePath);

          this.logger.debug(user)
          
          if (user) {
            this.logger.debug("hello here")
            
            delete user.accessToken;
            delete user.refreshToken;
            
            return user;
          } else {
            this.logger.debug("hello there")
            return null;
          }

        }

        return await this.userService.getUser(userId);
        
      } catch (error) {
          console.error('Error saving file:', error);
          throw new Error('Failed to save file.');
      }
  }
  
}
