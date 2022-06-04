import { IsArray, IsOptional, IsString } from "class-validator"

export class CreateBookTitleDto {
    @IsString()
    public title: string

    @IsString()
    public author: string

    @IsOptional()
    @IsString()
    public image: string

    @IsOptional()
    @IsString()
    public description: string

    @IsOptional()
    @IsArray()
    public categoryIds: number[]

    @IsOptional()
    @IsArray()
    public bookIds: number[]
}