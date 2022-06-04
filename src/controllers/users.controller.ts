import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode, UseBefore, Req } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CreateReaderDto, CreateUserDto, UpdateUserProfileDto } from '@dtos/users.dto';
import { User } from '@prisma/client';
import userService from '@services/users.service';
import { validationMiddleware } from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { RequestWithUser } from '@/interfaces/auth.interface';

@Controller('/api')
export class UsersController {
  public userService = new userService();

  @Get('/users/borrower')
  @UseBefore(authMiddleware([11]))
  @OpenAPI({ summary: 'Return a list of Borrower' })
  async getBorrowers() {
    const findAllUsersData: User[] = await this.userService.findAllBorrower();
    return { data: findAllUsersData, message: 'findAll' };
  }

  @Get('/users/borrower/:id')
  @UseBefore(authMiddleware([11]))
  @OpenAPI({ summary: 'Return find a borrower' })
  async getBorrowerById(@Param('id') userId: number) {
    const findOneUserData: User = await this.userService.findBorrowerByIdIncludeAllData(userId);
    return { data: findOneUserData, message: 'findOne' };
  }

  @Get('/users')
  @UseBefore(authMiddleware([3]))
  @OpenAPI({ summary: 'Return a list of users' })
  async getUsers() {
    const findAllUsersData: User[] = await this.userService.findAllUser();
    return { data: findAllUsersData, message: 'findAll' };
  }

  @Get('/users/:id')
  @UseBefore(authMiddleware([3]))
  @OpenAPI({ summary: 'Return find a user' })
  async getUserById(@Param('id') userId: number) {
    const findOneUserData: User = await this.userService.findUserById(userId);
    return { data: findOneUserData, message: 'findOne' };
  }


  @Get('/users/borrow/status')
  @UseBefore(authMiddleware([21]))
  @OpenAPI({ summary: 'Return find a user and all relate data' })
  async getUserByIdIncludeAllData(@Req() req: RequestWithUser) {
    const findOneUserData: User = await this.userService.findUserByIdIncludeAllData(req.user.id);
    return { data: findOneUserData, message: 'All data' };
  }

  @Get('/users/borrow/notifies')
  @UseBefore(authMiddleware([21]))
  @OpenAPI({ summary: 'Return user notifies' })
  async getUserNotifies(@Req() req: RequestWithUser) {
    const userWithNotifies: User = await this.userService.findUserNotifies(req.user.id);
    return { data: userWithNotifies, message: 'Notifies' };
  }

  @Post('/users/reader')
  @HttpCode(201)
  @UseBefore(authMiddleware([13]))
  @UseBefore(validationMiddleware(CreateReaderDto, 'body'))
  @OpenAPI({ summary: 'Create a new reader' })
  async createReader(@Body() readerData: CreateReaderDto) {
    const createReaderData: User = await this.userService.createReader(readerData);
    return { data: createReaderData, message: 'created' };
  }

  @Post('/users')
  @HttpCode(201)
  @UseBefore(authMiddleware([1]))
  @UseBefore(validationMiddleware(CreateUserDto, 'body'))
  @OpenAPI({ summary: 'Create a new user' })
  async createUser(@Body() userData: CreateUserDto) {
    const createUserData: User = await this.userService.createUser(userData);
    return { data: createUserData, message: 'created' };
  }

  @Put('/users/profile')
  @UseBefore(authMiddleware([22]))
  @UseBefore(validationMiddleware(UpdateUserProfileDto, 'body', true))
  @OpenAPI({ summary: 'Update a user profile' })
  async updateProfile(@Req() req: RequestWithUser, @Body() userData: UpdateUserProfileDto) {
    console.log("update profile")
    const updateUserData: User = await this.userService.updateProfile(req.user.id, userData);
    return { data: updateUserData, message: 'updated' };
  }

  @Put('/users/:id')
  @UseBefore(authMiddleware([4]))
  @UseBefore(validationMiddleware(CreateUserDto, 'body', true))
  @OpenAPI({ summary: 'Update a user' })
  async updateUser(@Param('id') userId: number, @Body() userData: CreateUserDto) {
    console.log("update user")
    const updateUserData: User = await this.userService.updateUser(userId, userData);
    return { data: updateUserData, message: 'updated' };
  }

  @Delete('/users/:id')
  @UseBefore(authMiddleware([2]))
  @OpenAPI({ summary: 'Delete a user' })
  async deleteUser(@Param('id') userId: number) {
    const deleteUserData: User = await this.userService.deleteUser(userId);
    return { data: deleteUserData, message: 'deleted' };
  }
}
