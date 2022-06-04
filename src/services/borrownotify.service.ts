import { HttpException } from '@exceptions/HttpException';
import { BorrowNotify } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import { CreateBorrowNotifyDto } from '@/dtos/borrownotify.dto';

class BorrowNotifyService {
    public BorrowNotifys = prisma.borrowNotify;

    public async findAllBorrowNotify(): Promise<BorrowNotify[]> {
        const BorrowNotifys: BorrowNotify[] = await this.BorrowNotifys.findMany({
            orderBy: {
                isRead: "asc"
            }
        });
        return BorrowNotifys;
    }

    public async findBorrowNotifyById(BorrowNotifyId: number): Promise<BorrowNotify> {
        const findBorrowNotify: BorrowNotify = await this.BorrowNotifys.findUnique({ where: { id: BorrowNotifyId }, include: { BorrowBill: true } })
        if (!findBorrowNotify) throw new HttpException(409, "You're not BorrowNotify");

        return findBorrowNotify;
    }

    public async createBorrowNotify(BorrowNotifyData: CreateBorrowNotifyDto): Promise<BorrowNotify> {
        if (isEmpty(BorrowNotifyData)) throw new HttpException(400, "You're not BorrowNotifyData");

        const createBorrowNotifyData: BorrowNotify = await this.BorrowNotifys.create({
            data: {
                title: BorrowNotifyData.title,
                content: BorrowNotifyData.content,
                isRead: false,
                BorrowBill: {
                    connect: { id: BorrowNotifyData.borrowBillId }
                }
            }
        });

        return createBorrowNotifyData;
    }

    public async updateBorrowNotify(BorrowNotifyId: number, BorrowNotifyData: CreateBorrowNotifyDto): Promise<BorrowNotify> {
        if (isEmpty(BorrowNotifyData)) throw new HttpException(400, "Empty update data");

        const findBorrowNotify: BorrowNotify = await this.BorrowNotifys.findUnique({ where: { id: BorrowNotifyId } })
        if (!findBorrowNotify) throw new HttpException(409, "Your book title not exist");

        const updateBorrowNotifyData: BorrowNotify = await this.BorrowNotifys.update({
            where: { id: BorrowNotifyId },
            data: {
                title: BorrowNotifyData.title,
                content: BorrowNotifyData.content,
                isRead: false,
                BorrowBill: {
                    connect: { id: BorrowNotifyData.borrowBillId }
                }
            }
        });

        return updateBorrowNotifyData;
    }

    public async deleteBorrowNotify(BorrowNotifyId: number): Promise<BorrowNotify> {
        const findBorrowNotify: BorrowNotify = await this.BorrowNotifys.findUnique({ where: { id: BorrowNotifyId } });
        if (!findBorrowNotify) throw new HttpException(409, "You're not BorrowNotify");

        const deleteBorrowNotifyData = await this.BorrowNotifys.delete({ where: { id: BorrowNotifyId } });
        return deleteBorrowNotifyData;
    }
}

export default BorrowNotifyService;
