import { Request, Response } from 'express';
import path from 'path';
import { Controller, Get, Render, Req, Res } from 'routing-controllers';

@Controller()
export class IndexController {
  @Get('/')
  index() {
  }
}
