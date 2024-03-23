/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
// import { FriendshipDto } from "./dto/friendship.dto";


@Injectable()
export class GameService{
    private logger = new Logger();
    constructor(private readonly prisma: PrismaService){}

    async getUserName(userId: string) {
        return this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })
    }
}