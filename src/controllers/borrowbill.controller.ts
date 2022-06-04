import { CreateBorrowBillDto, UpdateBorrowBillDto } from "@/dtos/borrowbill.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import BorrowBillService from "@/services/borrowbill.service";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class BorrowBillController {
    borrowBillService = new BorrowBillService()

    @Get('/borrowbill')
    @UseBefore(authMiddleware([12]))
    @OpenAPI({ summary: '' })
    async getAll() {
        const bills = await this.borrowBillService.findAllBorrowBill()
        return { data: bills, message: 'OK' };
    }

    @Get('/borrowbill/:id')
    @UseBefore(authMiddleware([12]))
    @OpenAPI({ summary: '' })
    async getOne(@Param('id') billId: number) {
        const bill = await this.borrowBillService.findBorrowBillById(billId)
        return { data: bill, message: 'OK' };
    }

    @Post('/borrowbill')
    @UseBefore(authMiddleware([13]))
    @UseBefore(validationMiddleware(CreateBorrowBillDto, 'body'))
    @HttpCode(201)
    async create(@Body() bill: CreateBorrowBillDto) {
        const createdBill = await this.borrowBillService.createBorrowBill(bill)
        return { data: createdBill, message: 'created' };
    }

    @Put('/borrowbill/:id')
    @UseBefore(authMiddleware([15]))
    @UseBefore(validationMiddleware(CreateBorrowBillDto, 'body', true))
    async update(@Param('id') billId: number, @Body() bill: UpdateBorrowBillDto) {
        const updateBill = await this.borrowBillService.updateBorrowBill(billId, bill)
        return { data: updateBill, message: 'updated' };
    }

    @Put('/borrowbill/return/:id')
    @UseBefore(authMiddleware([15]))
    async return(@Param('id') billId: number) {
        const updateBill = await this.borrowBillService.returnBorrowBill(billId)
        return { data: updateBill, message: 'returned' };
    }

    @Delete('/borrowbill/:id')
    @UseBefore(authMiddleware([14]))
    async delete(@Param('id') billId: number) {
        const deleteBill = await this.borrowBillService.deleteBorrowBill(billId)
        return { data: deleteBill, message: 'deleted' };
    }
}