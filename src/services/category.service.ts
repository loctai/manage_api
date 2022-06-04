import { HttpException } from '@exceptions/HttpException';
import { Category } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import { CreateCategoryDto } from '@/dtos/category.dto';

class CategoryService {
    public Categorys = prisma.category;

    public async findAllCategory(): Promise<Category[]> {
        const Categorys: Category[] = await this.Categorys.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        return Categorys;
    }

    public async findCategoryById(CategoryId: number): Promise<Category> {
        const findCategory: Category = await this.Categorys.findUnique({ where: { id: CategoryId }, include: { bookTitles: true } })
        if (!findCategory) throw new HttpException(409, "You're not Category");

        return findCategory;
    }

    public async createCategory(CategoryData: CreateCategoryDto): Promise<Category> {
        if (isEmpty(CategoryData)) throw new HttpException(400, "You're not CategoryData");

        const findCategory: Category = await this.Categorys.findUnique({ where: { name: CategoryData.name } });
        if (findCategory) throw new HttpException(409, `Your name ${CategoryData.name} already exists`);

        const bookTitles = CategoryData.bookTitleIds.map(id => { return { id: id } })
        const createCategoryData: Category = await this.Categorys.create({
            data: {
                name: CategoryData.name,
                bookTitles: {
                    connect: bookTitles
                }
            }
        });

        return createCategoryData;
    }

    public async updateCategory(CategoryId: number, CategoryData: CreateCategoryDto): Promise<Category> {
        if (isEmpty(CategoryData)) throw new HttpException(400, "Empty update data");

        var findCategory: Category = await this.Categorys.findUnique({ where: { id: CategoryId } })
        if (!findCategory) throw new HttpException(409, "Your book title not exist");

        // findCategory = await this.Categorys.findUnique({ where: { name: CategoryData.name } });
        // if (findCategory) throw new HttpException(409, `Your name ${CategoryData.name} already exists`);

        const bookTitles = CategoryData.bookTitleIds.map(id => { return { id: id } })
        const updateCategoryData = await this.Categorys.update({
            where: { id: CategoryId },
            data: {
                name: CategoryData.name,
                bookTitles: {
                    set: bookTitles
                }
            }
        });

        return updateCategoryData;
    }

    public async deleteCategory(CategoryId: number): Promise<Category> {
        const findCategory: Category = await this.Categorys.findUnique({ where: { id: CategoryId } });
        if (!findCategory) throw new HttpException(409, "You're not Category");

        const deleteCategoryData = await this.Categorys.delete({ where: { id: CategoryId } });
        return deleteCategoryData;
    }
}

export default CategoryService;
