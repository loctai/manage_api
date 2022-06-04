import { IsArray, IsEmail, IsNumber, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  public username: string;

  @IsString()
  public password: string;
}

export class SignupDto {
  @IsString()
  public username: string;

  @IsString()
  public password: string;
}

export class CreateUserDto {
  @IsString()
  public username: string;

  @IsString()
  public password: string;

  @IsArray()
  public groupIds: number[];

  @IsString()
  public fname: string;

  @IsString()
  public lname: string;

  @IsEmail()
  public email: string;
}

export class CreateReaderDto {
  @IsString()
  public username: string;

  @IsString()
  public password: string;

  @IsString()
  public fname: string;

  @IsString()
  public lname: string;

  @IsEmail()
  public email: string;
}

export class UpdateUserDto {
  @IsString()
  public username: string;

  @IsString()
  public password: string;

  @IsArray()
  public groupIds: number[];

  @IsString()
  public fname: string;

  @IsString()
  public lname: string;

  @IsEmail()
  public email: string;
}

export class UpdateUserProfileDto {
  @IsString()
  public password: string;

  @IsString()
  public newPassword: string;

  @IsString()
  public fname: string;

  @IsString()
  public lname: string;

  @IsEmail()
  public email: string;
}