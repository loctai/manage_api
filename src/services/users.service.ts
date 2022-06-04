import { compare, hash } from 'bcrypt';
import { CreateReaderDto, CreateUserDto, UpdateUserDto, UpdateUserProfileDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { BorrowNotify, User } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import BorrowBillService from './borrowbill.service';
import { email } from 'envalid';

class UserService {
  public users = prisma.user;
  public borrowNotifies = prisma.borrowNotify;
  public borrowBillService = new BorrowBillService();

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.users.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
    return users;
  }

  public async findAllBorrower(): Promise<User[]> {
    const users: User[] = await this.users.findMany({
      orderBy: [
        {
          borrowRegister: {
            _count: "desc"
          }
        },
        {
          borrowBills: {
            _count: "desc"
          },
        },
        {
          createdAt: "desc",
        }
      ],
      include: {
        _count: {
          select: {
            borrowBills: true,
            borrowRegister: true,
          }
        }
      }
    });
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await this.users.findUnique({
      where: { id: userId },
      include: { groups: true },
    })
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async findUserByIdIncludeAllData(userId: number): Promise<User> {
    //await this.borrowBillService.createOverdueNotify(userId)
    const findUser: User = await this.users.findUnique({
      where: { id: userId },
      include: {
        borrowRegister: {
          orderBy: {
            createDate: "desc"
          },
          include: {
            books: {
              include: {
                BookTitle: true
              }
            }
          }
        },
        borrowBills: {
          include: {
            notifies: {
              orderBy: {
                createDate: "desc"
              }
            },
            books: {
              include: {
                BookTitle: true
              }
            }
          },
          orderBy: {
            planReturnDate: "desc"
          }
        },
      }
    })
    if (!findUser) throw new HttpException(409, "Borrwer not exist");

    return findUser;
  }

  public async findBorrowerByIdIncludeAllData(userId: number): Promise<User> {
    //await this.borrowBillService.createOverdueNotify(userId)
    const findUser: User = await this.users.findUnique({
      where: { id: userId },
      include: {
        borrowRegister: {
          orderBy: [
            { isConfirmed: "asc" },
            { createDate: "desc" }
          ],
          include: {
            books: {
              include: {
                BookTitle: true
              }
            }
          }
        },
        borrowBills: {
          include: {
            notifies: {
              orderBy: {
                createDate: "desc"
              }
            },
            books: {
              include: {
                BookTitle: true
              }
            }
          },
          orderBy: [
            { isReturned: "asc" },
            { planReturnDate: "desc" }
          ]
        },
      }
    })
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }


  public async findUserNotifies(userId: number): Promise<User> {
    //await this.borrowBillService.createOverdueNotify(userId)
    const userWithNotify: User = await this.users.findUnique({
      where: { id: userId },
      include: {
        borrowBills: {
          include: {
            notifies: true
          }
        }
      }
    })
    if (!userWithNotify) throw new HttpException(409, "You're not user");

    return userWithNotify;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findUnique({ where: { username: userData.username } });
    if (findUser) throw new HttpException(409, `Your username ${userData.username} already exists`);

    const findUser2: User = await this.users.findUnique({ where: { email: userData.email } });
    if (findUser2) throw new HttpException(409, `Your email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const groups = userData.groupIds.map(id => { return { id: id } })
    const createUserData: User = await this.users.create({
      data: {
        username: userData.username,
        password: hashedPassword,
        fname: userData.fname,
        lname: userData.lname,
        groups: {
          connect: groups
        },
        email: userData.email
      }
    });

    return createUserData;
  }

  public async createReader(readerData: CreateReaderDto): Promise<User> {
    if (isEmpty(readerData)) throw new HttpException(400, "No Reader data");

    const findUser: User = await this.users.findUnique({ where: { username: readerData.username } });
    if (findUser) throw new HttpException(409, `Reader username ${readerData.username} already exists`);

    const findUser2: User = await this.users.findUnique({ where: { email: readerData.email } });
    if (findUser2) throw new HttpException(409, `Reader email ${readerData.email} already exists`);

    const readerGroupName = "_" + readerData.username;
    const hashedPassword = await hash(readerData.password, 10);
    const createUserData: User = await this.users.create({
      data: {
        username: readerData.username,
        password: hashedPassword,
        fname: readerData.fname,
        lname: readerData.lname,
        groups: {
          create: { name: readerGroupName },
          connect: { id: 4 }
        },
        email: readerData.email
      }
    });

    return createUserData;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "Empty parameter");

    const findUser: User = await this.users.findUnique({ where: { id: userId } })
    if (!findUser) throw new HttpException(409, "User ID not exist");

    const findUserWithEmail: User[] = await this.users.findMany({ where: { email: userData.email } })
    if (findUserWithEmail.some(u => u.id != userId)) {
      throw new HttpException(409, "User Email existed!");
    }

    const groups = userData.groupIds.map(id => { return { id: id } })
    let updateUserData: User;
    if (userData.password == "") {
      updateUserData = await this.users.update({
        where: { id: userId },
        data: {
          username: userData.username,
          fname: userData.fname,
          lname: userData.lname,
          groups: {
            set: groups
          },
          email: userData.email
        }
      });
    } else {
      const hashedPassword = await hash(userData.password, 10);
      updateUserData = await this.users.update({
        where: { id: userId },
        data: {
          username: userData.username,
          password: hashedPassword,
          fname: userData.fname,
          lname: userData.lname,
          groups: {
            set: groups
          },
          email: userData.email
        }
      });
    }
    return updateUserData;
  }

  public async updateProfile(userId: number, userData: UpdateUserProfileDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findUnique({ where: { id: userId } })
    if (!findUser) throw new HttpException(409, "You're not user");

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "Your old password not matching");

    var updateUserData: User;

    if (userData.newPassword === "") {
      updateUserData = await this.users.update({
        where: { id: userId },
        data: {
          fname: userData.fname,
          lname: userData.lname,
          email: userData.email
        }
      });
    } else {
      const hashedPassword = await hash(userData.newPassword, 10);
      updateUserData = await this.users.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          fname: userData.fname,
          lname: userData.lname,
          email: userData.email
        }
      });
    }

    return updateUserData;
  }


  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await this.users.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "You're not user");

    const deleteUserData = await this.users.delete({ where: { id: userId } });
    return deleteUserData;
  }
}

export default UserService;
