import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import PermissionService from "@/services/permission.service";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class PermissionController {
    PermissionService = new PermissionService();

    @Get('/permission')
    @UseBefore(authMiddleware([1, 2, 3, 4]))
    @OpenAPI({ summary: '' })
    async getAll() {
        const Permissions = await this.PermissionService.findAllPermission();
        return { data: Permissions, message: 'OK' };
    }

    @Get('/permission/:id')
    @UseBefore(authMiddleware([1, 2, 3, 4]))
    @OpenAPI({ summary: '' })
    async getOne(@Param('id') categoryId: number) {
        const Permission = await this.PermissionService.findPermissionById(categoryId);
        return { data: Permission, message: 'OK' };
    }
}