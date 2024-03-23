/* eslint-disable prettier/prettier */
// export class RoomDto {
//     id: string;
//     roomName: string;
//     roomType: string;
//     image: string;
// }

export class RoomDto {
    id: string;
    roomName: string;
    members: number;
    group: {
        name: string;
        images: string[];
        lastMessage: string | null;
    };
}

