import { HttpException } from '@exceptions/HttpException';
import { Book } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import { CreateBookDto } from '@/dtos/book.dto';

class BookService {
    public books = prisma.book;

    public async findAllBook(): Promise<Book[]> {
        const Books: Book[] = await this.books.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return Books;
    }

    public async findBookById(BookId: number): Promise<Book> {
        const findBook: Book = await this.books.findUnique({
            where: { id: BookId },
            include: { borrowRegisters: true, BookTitle: true, borrowBills: true }
        })
        if (!findBook) throw new HttpException(409, "You're not Book");

        return findBook;
    }

    public async createBook(BookData: CreateBookDto): Promise<Book> {
        if (isEmpty(BookData)) throw new HttpException(400, "You're not BorrowRegisterData");

        const createBookData: Book = await this.books.create({
            data: {
                isGood: BookData.isGood,
                BookTitle: {
                    connect: { id: BookData.bookTitleId }
                }
            }
        });

        return createBookData;
    }

    public async updateBook(BookId: number, BookData: CreateBookDto): Promise<Book> {
        if (isEmpty(BookData)) throw new HttpException(400, "Empty update data");

        const findBook: Book = await this.books.findUnique({ where: { id: BookId } })
        if (!findBook) throw new HttpException(409, "Your book title not exist");

        const updateBookData = await this.books.update({
            where: { id: BookId },
            data: {
                isGood: BookData.isGood,
                BookTitle: {
                    connect: { id: BookData.bookTitleId }
                }
            }
        });

        return updateBookData;
    }

    public async deleteBook(BookId: number): Promise<Book> {
        const findBook: Book = await this.books.findUnique({ where: { id: BookId } });
        if (!findBook) throw new HttpException(409, "You're not Book");

        const deleteBookData = await this.books.delete({ where: { id: BookId } });
        return deleteBookData;
    }
}

export default BookService;
