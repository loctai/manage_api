import { HttpException } from '@exceptions/HttpException';
import { BorrowBill } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import { CreateBorrowBillDto, UpdateBorrowBillDto } from '@/dtos/borrowbill.dto';
import getCurrentDate from '@/utils/getCurrentDate';

class BorrowBillService {
    public readonly MIN_RETURN_TIME = 7
    public readonly MAX_RETURN_TIME = 300
    public BorrowBills = prisma.borrowBill;

    public async findAllBorrowBill(): Promise<BorrowBill[]> {
        const BorrowBills: BorrowBill[] = await this.BorrowBills.findMany({
            orderBy: {
                planReturnDate: "desc"
            }
        });
        return BorrowBills;
    }

    public async findBorrowBillById(BorrowBillId: number): Promise<BorrowBill> {
        const findBorrowBill: BorrowBill = await this.BorrowBills.findUnique({ where: { id: BorrowBillId }, include: { books: true, user: true } })
        if (!findBorrowBill) throw new HttpException(409, "You're not BorrowBill");

        return findBorrowBill;
    }

    public async createBorrowBill(BorrowBillData: CreateBorrowBillDto): Promise<BorrowBill> {
        if (isEmpty(BorrowBillData)) throw new HttpException(400, "You're not BorrowBillData");

        const books = BorrowBillData.bookIds.map(id => { return { id: id } })
        const createBorrowBillData = await this.BorrowBills.create({
            data: {
                isReturned: false,
                planReturnDate: BorrowBillData.planReturnDate,
                user: {
                    connect: { id: BorrowBillData.userId }
                },
                books: {
                    connect: books
                }
            }
        });

        return createBorrowBillData;
    }

    public async createOverdueNotify(userId: number): Promise<BorrowBill[]> {
        const now = getCurrentDate()

        const overdueBills = await this.BorrowBills.findMany({
            where: {
                userId: userId,
                planReturnDate: {
                    lte: now
                }
            }
        });

        await overdueBills.map(async bill => {
            return await this.BorrowBills.update({
                where: { id: bill.id },
                data: {
                    notifies: {
                        create: {
                            title: "[OVERDUE BOOK]",
                            content: "Please return our books",
                            isRead: false
                        }
                    }
                }
            })
        })

        return overdueBills;
    }

    public async updateBorrowBill(BorrowBillId: number, BorrowBillData: UpdateBorrowBillDto): Promise<BorrowBill> {
        if (isEmpty(BorrowBillData)) throw new HttpException(400, "Empty update data");

        const findBorrowBill: BorrowBill = await this.BorrowBills.findUnique({ where: { id: BorrowBillId } })
        if (!findBorrowBill) throw new HttpException(409, "Your book title not exist");

        const books = BorrowBillData.bookIds.map(id => { return { id: id } })
        var notifies = []
        var returnDate = null
        if (BorrowBillData.isReturned != true) {
            notifies = BorrowBillData.notifyIds.map(id => { return { id: id } })
            returnDate = Date()
        }
        const updateBorrowBillData = await this.BorrowBills.update({
            where: { id: BorrowBillId },
            data: {
                isReturned: BorrowBillData.isReturned,
                planReturnDate: BorrowBillData.planReturnDate,
                returnDate: returnDate,
                user: {
                    connect: { id: BorrowBillData.userId }
                },
                books: {
                    set: books
                },
                notifies: {
                    set: notifies
                }
            }
        });

        return updateBorrowBillData;
    }

    public async returnBorrowBill(BorrowBillId: number): Promise<BorrowBill> {
        const findBorrowBill: BorrowBill = await this.BorrowBills.findUnique({ where: { id: BorrowBillId } })
        if (!findBorrowBill) throw new HttpException(409, "Your book title not exist");

        const updateBorrowBillData = await this.BorrowBills.update({
            where: { id: BorrowBillId },
            data: {
                isReturned: true,
                returnDate: getCurrentDate()
            }
        });

        return updateBorrowBillData;
    }

    public async deleteBorrowBill(BorrowBillId: number): Promise<BorrowBill> {
        const findBorrowBill: BorrowBill = await this.BorrowBills.findUnique({ where: { id: BorrowBillId } });
        if (!findBorrowBill) throw new HttpException(409, "You're not BorrowBill");

        const deleteBorrowBillData = await this.BorrowBills.delete({ where: { id: BorrowBillId } });
        return deleteBorrowBillData;
    }
}

export default BorrowBillService;
