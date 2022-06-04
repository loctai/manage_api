import { IsArray, IsString } from "class-validator"

export class CreateGroupDto {
    @IsString()
    public name: string

    @IsArray()
    public permissionIds: number[]

    @IsArray()
    public userIds: number[]
}