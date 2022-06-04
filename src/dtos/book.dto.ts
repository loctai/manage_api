import { IsBoolean, IsNumber } from "class-validator"

export class CreateBookDto {
    @IsBoolean()
    public isGood: boolean

    @IsNumber()
    public bookTitleId: number
}