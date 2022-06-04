import { HttpException } from '@exceptions/HttpException';
import { Book, BookTitle } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import { CreateBookTitleDto } from '@/dtos/booktitle.dto';

class BookTitleService {
    public bookTitles = prisma.bookTitle;
    public books = prisma.book;

    public async searchBookTitle(title: string, page: number, limit: number): Promise<BookTitle[]> {
        const BookTitles: BookTitle[] = await this.bookTitles.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: "desc"
            },
            include: { categorys: true },
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive'
                }
            }
        });
        return BookTitles;
    }

    public async findAllBookTitle(): Promise<BookTitle[]> {
        const BookTitles: BookTitle[] = await this.bookTitles.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: { categorys: true }
        });
        return BookTitles;
    }

    public async findBookTitleById(BookTitleId: number): Promise<BookTitle> {
        const findBookTitle: BookTitle = await this.bookTitles.findUnique({ where: { id: BookTitleId } })
        if (!findBookTitle) throw new HttpException(409, "Your ID not exist");

        return findBookTitle;
    }

    public async findBookTitleByIdIncludeBooks(BookTitleId: number): Promise<BookTitle> {
        const findBookTitle: BookTitle = await this.bookTitles.findUnique({
            where: { id: BookTitleId },
            include: { books: true, categorys: true }
        })
        if (!findBookTitle) throw new HttpException(409, "Your ID not exist");

        return findBookTitle;
    }

    public async findAvailableBooks(BookTitleId: number): Promise<Book[]> {
        const findBooks = await this.books.findMany({
            where: {
                bookTitleId: BookTitleId,
                borrowBills: {
                    none: {
                        isReturned: false
                    }
                },
                borrowRegisters: {
                    none: {}
                }
            }
        })

        return findBooks;
    }

    public async createBookTitle(BookTitleData: CreateBookTitleDto): Promise<BookTitle> {
        if (isEmpty(BookTitleData)) throw new HttpException(400, "Empty BookTitleData");

        const findBookTitle: BookTitle = await this.bookTitles.findUnique({ where: { title: BookTitleData.title } });
        if (findBookTitle) throw new HttpException(409, `Your Book Title ${BookTitleData.title} already exists`);

        const categorys = BookTitleData.categoryIds.map(id => { return { id: id } })
        const books = BookTitleData.bookIds.map(id => { return { id: id } })
        const createBookTitleData: BookTitle = await this.bookTitles.create({
            data: {
                title: BookTitleData.title,
                author: BookTitleData.author,
                image: BookTitleData.image,
                description: BookTitleData.description,
                categorys: {
                    connect: categorys
                },
                books: {
                    connect: books
                }
            }
        });

        return createBookTitleData;
    }

    public async updateBookTitle(BookTitleId: number, BookTitleData: CreateBookTitleDto): Promise<BookTitle> {
        if (isEmpty(BookTitleData)) throw new HttpException(400, "Empty update data");

        var findBookTitle: BookTitle = await this.bookTitles.findUnique({ where: { id: BookTitleId } })
        if (!findBookTitle) throw new HttpException(409, "Your book title not exist");

        const bookTitles: BookTitle[] = await this.bookTitles.findMany({ where: { title: BookTitleData.title } })
        if (bookTitles.some(b => b.id != BookTitleId)) {
            throw new HttpException(409, `Title: ${BookTitleData.title} existed!`);
        }

        const categorys = BookTitleData.categoryIds.map(id => { return { id: id } })
        const books = BookTitleData.bookIds.map(id => { return { id: id } })
        const updateBookTitleData = await this.bookTitles.update({
            where: { id: BookTitleId },
            data: {
                title: BookTitleData.title,
                author: BookTitleData.author,
                image: BookTitleData.image,
                description: BookTitleData.description,
                categorys: {
                    set: categorys
                },
                books: {
                    set: books
                }
            }
        });

        return updateBookTitleData;
    }

    public async deleteBookTitle(BookTitleId: number): Promise<BookTitle> {
        const findBookTitle: BookTitle = await this.bookTitles.findUnique({ where: { id: BookTitleId } });
        if (!findBookTitle) throw new HttpException(409, "Your ID not exist");

        const deleteBookTitleData = await this.bookTitles.delete({ where: { id: BookTitleId } });
        return deleteBookTitleData;
    }
}

export default BookTitleService;
