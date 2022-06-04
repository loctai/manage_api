import { hash } from 'bcrypt';
import prisma from '../dbclient'


export default class SeedData {
    private env;
    private readonly users = prisma.user;
    private readonly permissions = prisma.permission;
    private readonly groups = prisma.group;
    private readonly bookTitles = prisma.bookTitle;
    private readonly categories = prisma.category;

    constructor(env: any) {
        this.env = env
    }

    public async BeginSeeding() {
        const foundUser = await this.users.findFirst({ where: { username: 'admin' } })
        if (foundUser) {
            return;
        }

        const pers = await this.CreatePermision();
        console.log(pers)
        const adminGroup = await this.CreateAdminGroup();
        console.log(adminGroup)
        const managerGroup = await this.CreateManagerGroup();
        console.log(managerGroup)
        const librarianGroup = await this.CreateLibrarianGroup();
        console.log(librarianGroup)
        const readerGroup = await this.CreateReaderGroup();
        console.log(readerGroup)
        const admin = await this.CreateAdmin();
        console.log(admin)

        if (this.env == 'development') {
            await this.CreateCategories();
            await this.CreateBookTitle();
        }
    }

    private async CreatePermision() {
        return await this.permissions.createMany({
            data: [
                {
                    name: 'Create user'
                },
                {
                    name: 'Delete user'
                },
                {
                    name: 'Search user'
                },
                {
                    name: 'Modify user'
                },
                {
                    name: 'Search book'
                },
                {
                    name: 'Add book title'
                },
                {
                    name: 'Add book'
                },
                {
                    name: 'Update book title'
                },
                {
                    name: 'Update book'
                },
                {
                    name: 'Delete book title'
                },
                {
                    name: 'Delete book'
                },
                {
                    name: 'Search borrower'
                },
                {
                    name: 'Add borrower'
                },
                {
                    name: 'Delete borrwer'
                },
                {
                    name: 'Update borrower'
                },
                {
                    name: 'Notify overdue book borrowing'
                },
                {
                    name: 'Confirm borrowing registation'
                },
                {
                    name: 'Signup reader account'
                },
                {
                    name: 'Add book to cart'
                },
                {
                    name: 'Register to borrow books'
                },
                {
                    name: 'Check book borrowing status'
                },
                {
                    name: 'update profile'
                }
            ]
        })
    }

    private async CreateAdminGroup() {
        return await this.groups.create({
            data: {
                name: 'admin',
                permissions: {
                    connect: [
                        { id: 1 },
                        { id: 2 },
                        { id: 3 },
                        { id: 4 },
                        { id: 5 },
                        { id: 6 },
                        { id: 7 },
                        { id: 8 },
                        { id: 9 },
                        { id: 10 },
                        { id: 11 },
                        { id: 12 },
                        { id: 13 },
                        { id: 14 },
                        { id: 15 },
                        { id: 16 },
                        { id: 17 },
                        { id: 18 },
                        { id: 19 },
                        { id: 20 },
                        { id: 21 },
                        { id: 22 },
                    ]
                }
            }
        })
    }

    private async CreateManagerGroup() {
        return await this.groups.create({
            data: {
                name: 'manager',
                permissions: {
                    connect: [
                        { id: 5 },
                        { id: 6 },
                        { id: 7 },
                        { id: 8 },
                        { id: 9 },
                        { id: 10 },
                        { id: 11 },
                    ]
                }
            }
        })
    }

    private async CreateLibrarianGroup() {
        return await this.groups.create({
            data: {
                name: 'librarian',
                permissions: {
                    connect: [
                        { id: 5 },
                        { id: 12 },
                        { id: 13 },
                        { id: 14 },
                        { id: 15 },
                        { id: 16 },
                        { id: 17 },
                    ]
                }
            }
        })
    }

    private async CreateReaderGroup() {
        return await this.groups.create({
            data: {
                name: 'reader',
                permissions: {
                    connect: [
                        { id: 5 },
                        { id: 18 },
                        { id: 19 },
                        { id: 20 },
                        { id: 21 },
                    ]
                }
            }
        })
    }

    private async CreateAdmin() {
        const hashed = await hash("datngo123", 10)
        return await this.users.create({
            data: {
                username: 'admin',
                password: hashed,
                groups: {
                    create: { name: '_admin' },
                    connect: { id: 1 }
                }
            }
        })
    }

    private async CreateCategories() {
        return await this.categories.createMany({
            data: [
                {
                    name: "Romance"
                },
                {
                    name: "Methematic"
                },
                {
                    name: "Science"
                },
                {
                    name: "Mobile Programming"
                },
                {
                    name: "Web Programming"
                },
            ]
        })
    }

    private async CreateBookTitle() {
        return await this.bookTitles.createMany({
            data: [
                {
                    title: "Calculus 1",
                    author: "Dat Ngo",
                },
                {
                    title: "ASP.NET",
                    author: "Dat Ngo",
                },
                {
                    title: "React",
                    author: "Dat Ngo",
                },
                {
                    title: "NodeJS",
                    author: "Dat Ngo",
                },
            ]
        })
    }
}