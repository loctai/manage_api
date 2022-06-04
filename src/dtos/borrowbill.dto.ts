import { IsArray, IsBoolean, IsDate, IsNumber } from "class-validator"

export class CreateBorrowBillDto {
    @IsNumber()
    public userId: number

    @IsDate()
    public planReturnDate: Date

    @IsArray()
    public bookIds: number[]
}


export class UpdateBorrowBillDto {
    @IsNumber()
    public userId: number

    @IsDate()
    public planReturnDate: Date

    @IsArray()
    public bookIds: number[]

    @IsBoolean()
    public isReturned: boolean

    @IsArray()
    public notifyIds: number[]
}
