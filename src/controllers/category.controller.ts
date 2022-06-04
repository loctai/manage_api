import { CreateCategoryDto } from "@/dtos/category.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import CategoryService from "@/services/category.service";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class CategoryController {
    categoryService = new CategoryService();

    @Get('/category')
    @UseBefore(authMiddleware([6, 8, 10]))
    @OpenAPI({ summary: '' })
    async getAll() {
        const categorys = await this.categoryService.findAllCategory()
        return { data: categorys, message: 'OK' };
    }

    @Get('/category/:id')
    @UseBefore(authMiddleware([6, 8, 10]))
    @OpenAPI({ summary: '' })
    async getOne(@Param('id') categoryId: number) {
        const category = await this.categoryService.findCategoryById(categoryId)
        return { data: category, message: 'OK' };
    }

    @Post('/category')
    @UseBefore(authMiddleware([6, 8, 10]))
    @UseBefore(validationMiddleware(CreateCategoryDto, 'body'))
    @HttpCode(201)
    async create(@Body() category: CreateCategoryDto) {
        const createdCategory = await this.categoryService.createCategory(category)
        return { data: createdCategory, message: 'created' };
    }

    @Put('/category/:id')
    @UseBefore(authMiddleware([6, 8, 10]))
    @UseBefore(validationMiddleware(CreateCategoryDto, 'body', true))
    async update(@Param('id') categoryId: number, @Body() category: CreateCategoryDto) {
        const updatedCategory = await this.categoryService.updateCategory(categoryId, category)
        return { data: updatedCategory, message: 'updated' };
    }

    @Delete('/category/:id')
    @UseBefore(authMiddleware([6, 8, 10]))
    async delete(@Param('id') categoryId: number) {
        const deletedCategory = await this.categoryService.deleteCategory(categoryId)
        return { data: deletedCategory, message: 'deleted' };
    }
}