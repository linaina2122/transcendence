import {
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';
import { UpdateUserData } from './dto';

@Injectable()
export class UserService {
  private logger = new Logger();

  constructor(private prisma: PrismaService) {}

  // get user by id
  async getUser(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async updateUserAvatarName(userId: string, avatarUrl: string): Promise<User | null> {

    try {
      
      const userUpdated: User = await this.prisma.user.update(
        { 
          where: { id: userId },
          data: { avatarUrl: avatarUrl }, 
        }
      )

      return userUpdated;

    } catch (error) {
      return null;
    }

  }

  async updateUser(dataUser: UpdateUserData, userId: string): Promise<User | { message: string }> {

    
    try {

      // make sure the user is existing in db
      const checkUser = await this.prisma.user.findFirst({
        where: { id: dataUser.id },
      });
  
      if (!checkUser) {
        throw new NotAcceptableException();
      }
  
      if (!dataUser) {
        throw new NotFoundException();
      }
  
      // make sure the user has right to update by checking that the id is his id
      if (dataUser.id !== userId) {
        throw new NotAcceptableException();
      }

      let tmp: User = await this.prisma.user.findFirst({
        where: { username: dataUser.username}
      })

      if (tmp && tmp.id !== dataUser.id) {
        return {
          message: "notallowed"
        };
      }

      tmp = await this.prisma.user.findFirst({
        where: { email: dataUser.email}
      })

      if (tmp && tmp.id !== dataUser.id) {
        return {
          message: "notallowed"
        };
      }

      const user = this.prisma.user.update({
        where: { id: userId },
        data: {
          username: dataUser.username,
          fullName: dataUser.fullName,
          avatarUrl: dataUser.avatarUrl,
          Status: dataUser.Status,
          email: dataUser.email,
          twoFactor: dataUser.twoFactor,
        },
      });
      return user;
    } catch (error) {

      return {
        message: "notallowed"
      };
    }
    return {
      message: "notallowed"
    };
  }

  async getRefreshToken(@Req() req?: Request): Promise<string> {
    const refresh_token = (req.headers['refresh_token'] as string).trim();

    return refresh_token;
  }
}
