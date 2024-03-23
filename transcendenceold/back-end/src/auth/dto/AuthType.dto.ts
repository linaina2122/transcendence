import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class AuthDto {

    @ApiProperty({
        description: 'this code u can get it from the intra 24 api',
        example: "kdsqqsdhqisuhdiqshdisqudqiusndiuduiqsndiuqsnduiqsndiuqsnd",
    })

    @IsNotEmpty()
    code: string;
}