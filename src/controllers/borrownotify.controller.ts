import { CreateBorrowNotifyDto } from "@/dtos/borrownotify.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import BorrowNotifyService from "@/services/borrownotify.service";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class BorrowNotifyController {
    borrowNotify = new BorrowNotifyService()

    @Get('/borrownotify')
    @UseBefore(authMiddleware([16]))
    @OpenAPI({ summary: '' })
    async getAll() {
        const notifies = await this.borrowNotify.findAllBorrowNotify()
        return { data: notifies, message: 'OK' };
    }

    @Get('/borrownotify/:id')
    @UseBefore(authMiddleware([16]))
    @OpenAPI({ summary: '' })
    async getOne(@Param('id') notifyId: number) {
        const notify = await this.borrowNotify.findBorrowNotifyById(notifyId)
        return { data: notify, message: 'OK' };
    }

    @Post('/borrownotify')
    @UseBefore(authMiddleware([16]))
    @UseBefore(validationMiddleware(CreateBorrowNotifyDto, 'body'))
    @HttpCode(201)
    async create(@Body() notify: CreateBorrowNotifyDto) {
        const createNotify = await this.borrowNotify.createBorrowNotify(notify)
        return { data: createNotify, message: 'created' };
    }

    @Put('/borrownotify/:id')
    @UseBefore(authMiddleware([16]))
    @UseBefore(validationMiddleware(CreateBorrowNotifyDto, 'body', true))
    async update(@Param('id') notifyId: number, @Body() notify: CreateBorrowNotifyDto) {
        const updateNotify = await this.borrowNotify.updateBorrowNotify(notifyId, notify)
        return { data: updateNotify, message: 'updated' };
    }

    @Delete('/borrownotify/:id')
    @UseBefore(authMiddleware([16]))
    async delete(@Param('id') notifyId: number) {
        const deleteNotify = await this.borrowNotify.deleteBorrowNotify(notifyId)
        return { data: deleteNotify, message: 'deleted' };
    }
}