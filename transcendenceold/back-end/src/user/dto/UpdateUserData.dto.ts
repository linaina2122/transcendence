import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserData {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  Status: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  avatarUrl: string;
  
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  twoFactor: boolean;
}
