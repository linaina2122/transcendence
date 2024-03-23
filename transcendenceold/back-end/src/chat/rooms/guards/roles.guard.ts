/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { RoomsService } from "../rooms.service";
import { Reflector } from "@nestjs/core";


@Injectable()
export class RolesGuard implements CanActivate{
    constructor ( private roomsService: RoomsService, private reflector: Reflector) {}
	
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		// req.params.userId just for test
		const roleOfUser = await this.roomsService.getUserRoleInRoom(req.params.userId, req.params.roomId);
		if (!roleOfUser) { 
			return false; 
		}
		const roles = this.reflector.get<string[]>('roles', context.getHandler());
		if (!roles) { 
			return true; 
		}
		if (roles.includes(<string>roleOfUser)) { 
			return true; 
		}
		return false;
	}
}