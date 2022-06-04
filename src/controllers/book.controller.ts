import { CreateBookDto } from "@/dtos/book.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import BookService from "@/services/book.service";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class BookController {
    bookService = new BookService();

    @Get('/book')
    @UseBefore(authMiddleware([5]))
    @OpenAPI({ summary: '' })
    async getAll() {
        const books = await this.bookService.findAllBook()
        return { data: books, message: 'OK' };
    }

    @Get('/book/:id')
    @UseBefore(authMiddleware([5]))
    @OpenAPI({ summary: '' })
    async getOne(@Param('id') bookId: number) {
        const book = await this.bookService.findBookById(bookId)
        return { data: book, message: 'OK' };
    }

    @Post('/book')
    @UseBefore(authMiddleware([7]))
    @UseBefore(validationMiddleware(CreateBookDto, 'body'))
    @HttpCode(201)
    async create(@Body() book: CreateBookDto) {
        const createdBook = await this.bookService.createBook(book)
        return { data: createdBook, message: 'created' };
    }

    @Put('/book/:id')
    @UseBefore(authMiddleware([9]))
    @UseBefore(validationMiddleware(CreateBookDto, 'body', true))
    async update(@Param('id') bookId: number, @Body() book: CreateBookDto) {
        const updatedBook = await this.bookService.updateBook(bookId, book)
        return { data: updatedBook, message: 'updated' };
    }

    @Delete('/book/:id')
    @UseBefore(authMiddleware([11]))
    async delete(@Param('id') bookId: number) {
        const deletedBook = await this.bookService.deleteBook(bookId)
        return { data: deletedBook, message: 'deleted' };
    }
}