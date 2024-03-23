/* eslint-disable prettier/prettier */
export class CreateRoomDto {
    id?:            string;
    roomName:       string;
    roomType:       string;
    password?:      string;
    isProtected:    boolean;
    ownerID:        string;
    image?:         string;
    users?:         string[];
}
