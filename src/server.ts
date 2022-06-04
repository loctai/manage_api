import App from '@/app';
import { AuthController } from '@controllers/auth.controller';
import { IndexController } from '@controllers/index.controller';
import { UsersController } from '@controllers/users.controller';
import validateEnv from '@utils/validateEnv';
import { BookController } from './controllers/book.controller';
import { BookTitleController } from './controllers/bookTitle.controller';
import { BorrowBillController } from './controllers/borrowbill.controller';
import { BorrowNotifyController } from './controllers/borrownotify.controller';
import { BorrowRegisterController } from './controllers/borrowregister.controller';
import { CategoryController } from './controllers/category.controller';
import { GroupController } from './controllers/group.controller';
import { PermissionController } from './controllers/permission.controller';

validateEnv();

const app = new App([
    AuthController,
    UsersController,
    GroupController,
    PermissionController,
    BookTitleController,
    IndexController,
    BookController,
    BorrowBillController,
    BorrowNotifyController,
    BorrowRegisterController,
    CategoryController,
]);
app.listen();
