import { HttpException } from '@exceptions/HttpException';
import { Group } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import { CreateGroupDto } from '@/dtos/group.dto';

class GroupService {
    public Groups = prisma.group;

    public async findAllGroup(): Promise<Group[]> {
        const Groups: Group[] = await this.Groups.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        return Groups;
    }

    public async findGroupById(GroupId: number): Promise<Group> {
        const findGroup: any = await this.Groups.findUnique({
            where: { id: GroupId }, include: { permissions: true, users: true }
        })
        if (!findGroup) throw new HttpException(409, "Your Group ID not exist");

        return findGroup;
    }

    public async createGroup(GroupData: CreateGroupDto): Promise<Group> {
        if (isEmpty(GroupData)) throw new HttpException(400, "You're not BorrowRegisterData");

        const findGroup: Group = await this.Groups.findUnique({ where: { name: GroupData.name } });
        if (findGroup) throw new HttpException(409, `Your name ${GroupData.name} already exists`);

        const users = GroupData.userIds.map(id => { return { id: id } })
        const permissions = GroupData.permissionIds.map(id => { return { id: id } })
        const createGroupData: Group = await this.Groups.create({
            data: {
                name: GroupData.name,
                users: {
                    connect: users
                },
                permissions: {
                    connect: permissions
                }
            }
        });

        return createGroupData;
    }

    public async updateGroup(GroupId: number, GroupData: CreateGroupDto): Promise<Group> {
        if (isEmpty(GroupData)) throw new HttpException(400, "Empty update data");

        var findGroup: Group = await this.Groups.findUnique({ where: { id: GroupId } })
        if (!findGroup) throw new HttpException(409, "Your Group ID not exist");

        const findUserWithEmail: Group[] = await this.Groups.findMany({ where: { name: GroupData.name } })
        if (findUserWithEmail.some(u => u.id != GroupId)) {
            throw new HttpException(409, `Group ${GroupData.name} existed!`);
        }

        const users = GroupData.userIds.map(id => { return { id: id } })
        const permissions = GroupData.permissionIds.map(id => { return { id: id } })
        const updateGroupData: Group = await this.Groups.update({
            where: { id: GroupId },
            data: {
                name: GroupData.name,
                users: {
                    set: users
                },
                permissions: {
                    set: permissions
                }
            }
        });

        return updateGroupData;
    }

    public async deleteGroup(GroupId: number): Promise<Group> {
        const findGroup: Group = await this.Groups.findUnique({ where: { id: GroupId } });
        if (!findGroup) throw new HttpException(409, "Your Group ID not exist");

        const deleteGroupData = await this.Groups.delete({ where: { id: GroupId } });
        return deleteGroupData;
    }
}

export default GroupService;
