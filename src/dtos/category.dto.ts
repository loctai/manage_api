import { IsArray, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    public name: string

    @IsArray()
    public bookTitleIds: number[]
}